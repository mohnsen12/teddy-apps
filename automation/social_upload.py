#!/usr/bin/env python3
"""Upload local images/videos to Meta and LinkedIn; never log credentials."""
import argparse
from datetime import datetime, timezone
import fcntl
import hashlib
import json
import os
from pathlib import Path
import plistlib
import re
import sys
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid

from social_media import ROOT, atomic_json, prepare

API = 'https://graph.facebook.com/v25.0'
PAGE_ID = '1310521282144790'
IG_USERNAME = 'teddyapps82'
RUNTIME = ROOT / 'automation' / 'runtime'
HISTORY = {'facebook': 'posted_history.json', 'instagram': 'instagram_history.json', 'linkedin': 'linkedin_history.json'}
SECRETS = set()


def redact(value):
    text = str(value)
    for secret in SECRETS:
        if secret:
            text = text.replace(secret, '[REDACTED]')
    text = re.sub(r'EA[A-Za-z0-9]{40,}', '[REDACTED]', text)
    text = re.sub(r'(?i)(access_token|authorization|client_secret)[=:\s]+[^\s&,\"}]+', r'\1=[REDACTED]', text)
    return text[:2000]


class APIError(RuntimeError):
    def __init__(self, status, body):
        self.status = status
        self.body = body
        super().__init__(f'HTTP {status}: {redact(json.dumps(body, ensure_ascii=False))}')


def config():
    path = Path.home() / 'Library' / 'LaunchAgents' / 'ai.teddy.n8n.plist'
    raw_env = plistlib.loads(path.read_bytes())['EnvironmentVariables']
    for key, value in raw_env.items():
        if any(word in key for word in ('TOKEN', 'KEY', 'SECRET')):
            SECRETS.add(str(value))
    names = {
        'FACEBOOK_PAGE_ACCESS_TOKEN': 'TEDDY_FACEBOOK_PAGE_ACCESS_TOKEN',
        'IG_USER_ID': 'TEDDY_IG_USER_ID',
        'IG_USERNAME': 'TEDDY_IG_USERNAME',
        'LINKEDIN_ACCESS_TOKEN': 'TEDDY_LINKEDIN_ACCESS_TOKEN',
        'LINKEDIN_AUTHOR_URN': 'TEDDY_LINKEDIN_AUTHOR_URN',
        'LINKEDIN_API_VERSION': 'TEDDY_LINKEDIN_API_VERSION',
    }
    env = {key: raw_env[source] for key, source in names.items() if raw_env.get(source)}
    env['FACEBOOK_PAGE_ID'] = raw_env.get('TEDDY_FACEBOOK_PAGE_ID', PAGE_ID)
    return env


def request(url, method='GET', data=None, headers=None, timeout=180):
    req = urllib.request.Request(url, data=data, headers=headers or {}, method=method)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            raw = response.read()
            try:
                result = json.loads(raw) if raw else {}
            except ValueError:
                result = {}
            return result, dict(response.headers.items())
    except urllib.error.HTTPError as error:
        raw = error.read().decode('utf-8', errors='replace')
        try:
            body = json.loads(raw)
        except ValueError:
            body = {'message': raw[:500]}
        raise APIError(error.code, body) from None
    except (urllib.error.URLError, TimeoutError, OSError) as error:
        raise RuntimeError('Netvaerksfejl: ' + redact(getattr(error, 'reason', type(error).__name__))) from None


def graph(path, token, params=None, method='GET'):
    headers = {'Authorization': 'Bearer ' + token}
    url = API + '/' + path
    data = None
    if method == 'GET':
        if params:
            url += '?' + urllib.parse.urlencode(params)
    else:
        data = urllib.parse.urlencode(params or {}).encode()
        headers['Content-Type'] = 'application/x-www-form-urlencoded'
    return request(url, method, data, headers)[0]


def page_token(env):
    if env.get('FACEBOOK_PAGE_ID', PAGE_ID) != PAGE_ID:
        raise ValueError('Facebook-side-ID matcher ikke Teddy Apps.')
    token = env.get('FACEBOOK_PAGE_ACCESS_TOKEN')
    if not token:
        raise ValueError('Teddy Apps mangler Facebook-adgangsnøgle i n8n-konfigurationen.')
    try:
        account = graph(PAGE_ID, token, {'fields': 'id,name,access_token'})
        if account.get('access_token'):
            SECRETS.add(account['access_token'])
            return account['access_token']
        me = graph('me', token, {'fields': 'id'})
        if me.get('id') == PAGE_ID:
            return token
    except APIError:
        pass
    accounts = graph('me/accounts', token, {'fields': 'id,access_token', 'limit': 100})
    for account in accounts.get('data', []):
        if account['id'] == PAGE_ID and account.get('access_token'):
            SECRETS.add(account['access_token'])
            return account['access_token']
    raise ValueError('Ingen gyldig Facebook-sidenøgle for Teddy Apps.')


def check_instagram(env, token):
    account_id = env.get('IG_USER_ID')
    if not account_id:
        raise ValueError('Teddy Apps mangler Instagram-konto-ID i n8n-konfigurationen.')
    account = graph(account_id, token, {'fields': 'id,username'})
    if account.get('username') != env.get('IG_USERNAME', IG_USERNAME):
        raise ValueError('Instagram-brugernavnet matcher ikke Teddy Apps.')


def multipart(path, token, fields, file_path, field='source', start=0, length=None):
    boundary = 'kaffe-' + uuid.uuid4().hex
    with tempfile.TemporaryFile() as body:
        for key, value in fields.items():
            body.write((f'--{boundary}\r\nContent-Disposition: form-data; name="{key}"\r\n\r\n{value}\r\n').encode())
        extension = Path(file_path).suffix
        mime = 'image/jpeg' if extension == '.jpg' else 'video/mp4'
        body.write((f'--{boundary}\r\nContent-Disposition: form-data; name="{field}"; filename="media{extension}"\r\nContent-Type: {mime}\r\n\r\n').encode())
        with open(file_path, 'rb') as source:
            source.seek(start)
            remaining = length
            while remaining is None or remaining > 0:
                chunk = source.read(min(1024 * 1024, remaining) if remaining is not None else 1024 * 1024)
                if not chunk:
                    break
                body.write(chunk)
                if remaining is not None:
                    remaining -= len(chunk)
            if remaining:
                raise ValueError('Ufuldstaendig fil ved upload.')
        body.write(f'\r\n--{boundary}--\r\n'.encode())
        size = body.tell()
        body.seek(0)
        return request(API + '/' + path, 'POST', body, {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'multipart/form-data; boundary=' + boundary,
            'Content-Length': str(size)}, timeout=600)[0]


def upload_binary(url, path, headers, method='POST', allowed='meta', start=0, length=None):
    parsed = urllib.parse.urlparse(url)
    host = parsed.hostname or ''
    trusted = host == 'rupload.facebook.com' if allowed == 'meta' else any(
        host == domain or host.endswith('.' + domain) for domain in ('linkedin.com', 'licdn.com'))
    if parsed.scheme != 'https' or not trusted:
        raise ValueError('Uploadserveren er ikke en godkendt platformserver.')
    length = Path(path).stat().st_size if length is None else length
    with open(path, 'rb') as source:
        source.seek(start)
        # LinkedIn parts are bounded. Whole-file Meta uploads stream from disk.
        data = source.read(length) if start or length != Path(path).stat().st_size else source
        return request(url, method, data, {**headers, 'Content-Length': str(length)}, timeout=600)


def poll(check, ready, failed, description, attempts=120, interval=5):
    for attempt in range(attempts):
        value = check()
        if failed(value):
            raise RuntimeError(description + ' fejlede: ' + redact(json.dumps(value)))
        if ready(value):
            return value
        if attempt + 1 < attempts:
            time.sleep(interval)
    raise TimeoutError(description + ' blev ikke faerdig inden for tidsgraensen. Intet opslag er publiceret.')


class Publisher:
    def __init__(self, platform, payload, media, upload_only=False):
        self.platform, self.payload, self.media = platform, payload, media
        self.upload_only = upload_only
        self.env = config()
        self.message = payload['message']
        self.path = media['prepared_path']
        self.pending_path = RUNTIME / (platform + '-publication-pending.json')

    def publish_call(self, call):
        atomic_json(self.pending_path, {'run_id': self.payload.get('run_id'),
            'media_id': self.media['media_id'], 'at': datetime.now(timezone.utc).isoformat(),
            'note': 'Publication requested; inspect account before clearing this marker.'})
        try:
            return call()
        except APIError as error:
            # Definite client rejection is safe to retry. A timeout/5xx is ambiguous.
            if 400 <= error.status < 500:
                self.pending_path.unlink(missing_ok=True)
            raise

    def facebook(self):
        token = page_token(self.env)
        if self.media['media_type'] == 'image':
            call = lambda: multipart(PAGE_ID + '/photos', token, {
                'caption': self.message, 'published': 'false' if self.upload_only else 'true'}, self.path)
            response = call() if self.upload_only else self.publish_call(call)
            return {'post_id': response.get('post_id') or response['id'], 'media_type': 'image'}
        output = self.media['output']
        if output['width'] / output['height'] < .8 and 4 <= output['duration'] <= 60:
            initial = graph(PAGE_ID + '/video_reels', token, {'upload_phase': 'start'}, 'POST')
            vid = initial['video_id']
            result, _ = upload_binary(initial['upload_url'], self.path, {
                'Authorization': 'OAuth ' + token, 'offset': '0',
                'file_size': str(self.media['bytes']), 'Content-Type': 'application/octet-stream'})
            if not result.get('success'):
                raise RuntimeError('Facebook bekraeftede ikke videoupload.')
            poll(lambda: graph(vid, token, {'fields': 'status'}).get('status', {}),
                lambda s: s.get('uploading_phase', {}).get('status') == 'complete',
                lambda s: s.get('video_status') == 'error', 'Facebook upload')
            if self.upload_only:
                response = graph(PAGE_ID + '/video_reels', token,
                    {'upload_phase': 'finish', 'video_id': vid, 'video_state': 'DRAFT', 'description': self.message}, 'POST')
                if not response.get('success'):
                    raise RuntimeError('Facebook bekraeftede ikke videokladden.')
                poll(lambda: graph(vid, token, {'fields': 'status'}).get('status', {}),
                    lambda s: s.get('processing_phase', {}).get('status') == 'complete' or s.get('video_status') == 'ready',
                    lambda s: s.get('video_status') == 'error', 'Facebook videokladde')
                return {'video_id': vid, 'media_type': 'reel', 'upload_complete': True, 'video_state': 'DRAFT'}
            response = self.publish_call(lambda: graph(PAGE_ID + '/video_reels', token,
                {'upload_phase': 'finish', 'video_id': vid, 'video_state': 'PUBLISHED', 'description': self.message}, 'POST'))
            if not response.get('success'):
                raise RuntimeError('Facebook bekraeftede ikke publicering; manuel kontrol er nodvendig.')
            poll(lambda: graph(vid, token, {'fields': 'status'}).get('status', {}),
                lambda s: s.get('publishing_phase', {}).get('status') == 'complete',
                lambda s: s.get('video_status') == 'error', 'Facebook publicering')
            return {'video_id': vid, 'post_id': vid, 'media_type': 'reel'}
        # Feed upload preserves landscape composition and also supports longer videos.
        initial = graph(PAGE_ID + '/videos', token,
            {'upload_phase': 'start', 'file_size': self.media['bytes']}, 'POST')
        session, vid = initial['upload_session_id'], initial['video_id']
        start, end = int(initial['start_offset']), int(initial['end_offset'])
        while start < end:
            response = multipart(PAGE_ID + '/videos', token,
                {'upload_phase': 'transfer', 'upload_session_id': session, 'start_offset': start},
                self.path, 'video_file_chunk', start, end - start)
            next_start, next_end = int(response['start_offset']), int(response['end_offset'])
            if next_start <= start:
                raise RuntimeError('Facebook videoupload gik i sta.')
            start, end = next_start, next_end
        call = lambda: graph(PAGE_ID + '/videos', token,
            {'upload_phase': 'finish', 'upload_session_id': session, 'description': self.message,
             'published': 'false' if self.upload_only else 'true'}, 'POST')
        response = call() if self.upload_only else self.publish_call(call)
        if not response.get('success'):
            raise RuntimeError('Facebook bekraeftede ikke videobehandling.')
        poll(lambda: graph(vid, token, {'fields': 'status'}).get('status', {}),
            lambda s: s.get('video_status') == 'ready',
            lambda s: s.get('video_status') == 'error', 'Facebook videobehandling')
        return {'video_id': vid, 'post_id': vid, 'media_type': 'video'}

    def instagram(self):
        token = page_token(self.env)
        check_instagram(self.env, token)
        account_id = self.env['IG_USER_ID']
        staging_id = None
        if self.media['media_type'] == 'image':
            # Stage with Meta itself, unpublished; no website deployment or third-party host.
            photo = multipart(PAGE_ID + '/photos', token, {'published': 'false'}, self.path)
            staging_id = photo['id']
            variants = graph(staging_id, token, {'fields': 'images'})['images']
            image_url = max(variants, key=lambda i: i['width'] * i['height'])['source']
            container = graph(account_id + '/media', token, {'image_url': image_url, 'caption': self.message}, 'POST')
        else:
            container = graph(account_id + '/media', token, {
                'media_type': 'REELS', 'upload_type': 'resumable', 'caption': self.message,
                'share_to_feed': 'true'}, 'POST')
            result, _ = upload_binary(container['uri'], self.path, {
                'Authorization': 'OAuth ' + token, 'offset': '0',
                'file_size': str(self.media['bytes']), 'Content-Type': 'application/octet-stream'})
            if not result.get('success'):
                raise RuntimeError('Instagram bekraeftede ikke videoupload.')
        cid = container['id']
        poll(lambda: graph(cid, token, {'fields': 'status_code,status'}),
            lambda s: s.get('status_code') == 'FINISHED',
            lambda s: s.get('status_code') in ('ERROR', 'EXPIRED'), 'Instagram mediebehandling')
        result = {'creation_id': cid, 'media_type': self.media['media_type'], 'account': self.env.get('IG_USERNAME', IG_USERNAME)}
        if staging_id:
            result['staging_photo_id'] = staging_id
        if not self.upload_only:
            response = self.publish_call(lambda: graph(account_id + '/media_publish', token, {'creation_id': cid}, 'POST'))
            result['instagram_media_id'] = response['id']
        return result

    def linkedin(self):
        token, author = self.env['LINKEDIN_ACCESS_TOKEN'], self.env['LINKEDIN_AUTHOR_URN']
        if not author.startswith(('urn:li:person:', 'urn:li:organization:')):
            raise ValueError('Ugyldig LinkedIn-afsender.')
        headers = {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json',
            'LinkedIn-Version': self.env.get('LINKEDIN_API_VERSION', '202608'),
            'X-Restli-Protocol-Version': '2.0.0'}

        def li(path, body=None):
            return request('https://api.linkedin.com/' + path, 'POST' if body is not None else 'GET',
                json.dumps(body).encode() if body is not None else None, headers)

        kind = self.media['media_type']
        if kind == 'image':
            reg, _ = li('v2/assets?action=registerUpload', {'registerUploadRequest': {
                'recipes': ['urn:li:digitalmediaRecipe:feedshare-image'], 'owner': author,
                'serviceRelationships': [{'relationshipType': 'OWNER', 'identifier': 'urn:li:userGeneratedContent'}],
                'supportedUploadMechanism': ['SYNCHRONOUS_UPLOAD']}})
            value = reg['value']
            asset = value['asset']
            url = value['uploadMechanism']['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest']['uploadUrl']
            upload_binary(url, self.path, {'Authorization': 'Bearer ' + token, 'Content-Type': 'image/jpeg'},
                'PUT', 'linkedin')
        else:
            reg, _ = li('rest/videos?action=initializeUpload', {'initializeUploadRequest': {
                'owner': author, 'fileSizeBytes': self.media['bytes'], 'uploadCaptions': False, 'uploadThumbnail': False}})
            value = reg['value']
            asset = value['video']
            parts = []
            for part in value['uploadInstructions']:
                length = int(part['lastByte']) - int(part['firstByte']) + 1
                _, response_headers = upload_binary(part['uploadUrl'], self.path,
                    {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/octet-stream'},
                    'PUT', 'linkedin', int(part['firstByte']), length)
                etag = next((v for k, v in response_headers.items() if k.lower() == 'etag'), None)
                if not etag:
                    raise RuntimeError('LinkedIn returnerede ikke ETag for videodelen.')
                parts.append(etag.strip('"'))
            li('rest/videos?action=finalizeUpload', {'finalizeUploadRequest': {
                'video': asset, 'uploadToken': value.get('uploadToken', ''), 'uploadedPartIds': parts}})
            poll(lambda: li('rest/videos/' + urllib.parse.quote(asset, safe=''))[0],
                lambda s: s.get('status') == 'AVAILABLE',
                lambda s: s.get('status') in ('PROCESSING_FAILED', 'FAILED'), 'LinkedIn videobehandling')
        result = {'asset': asset, 'author': author, 'media_type': kind}
        if not self.upload_only:
            if kind == 'video':
                # Videos API returns a video URN, not a legacy digitalmediaAsset URN.
                endpoint = 'rest/posts'
                body = {'author': author, 'commentary': self.message, 'visibility': 'PUBLIC',
                    'distribution': {'feedDistribution': 'MAIN_FEED', 'targetEntities': [], 'thirdPartyDistributionChannels': []},
                    'content': {'media': {'id': asset, 'title': 'Teddy Apps'}},
                    'lifecycleState': 'PUBLISHED', 'isReshareDisabledByAuthor': False}
            else:
                endpoint = 'v2/ugcPosts'
                body = {'author': author, 'lifecycleState': 'PUBLISHED',
                    'specificContent': {'com.linkedin.ugc.ShareContent': {
                        'shareCommentary': {'text': self.message}, 'shareMediaCategory': 'IMAGE',
                        'media': [{'status': 'READY', 'media': asset, 'title': {'text': 'Teddy Apps'}}]}},
                    'visibility': {'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'}}
            response, response_headers = self.publish_call(lambda: li(endpoint, body))
            post = next((v for k, v in response_headers.items() if k.lower() == 'x-restli-id'), None) or response.get('id')
            if not post:
                raise RuntimeError('LinkedIn returnerede ikke et opslag-ID; manuel kontrol er nodvendig.')
            result['post_urn'] = post
        return result


def log_history(platform, payload, media, result):
    path = ROOT / 'automation' / HISTORY[platform]
    history = json.loads(path.read_text()) if path.exists() else []
    run_id = payload['run_id']
    if not any(row.get('run_id') == run_id for row in history):
        history.insert(0, {'run_id': run_id, 'post_id': payload.get('post_id'),
            'category': payload.get('category'), 'media_id': media['media_id'],
            'media_path': media['media_path'], 'media_type': media['media_type'],
            'sha256': media['sha256'], 'posted_at': datetime.now(timezone.utc).isoformat(),
            platform + '_response': result})
        atomic_json(path, history[:500])


def run(platform, payload, dry_run=False, upload_only=False):
    dry_run = dry_run or os.environ.get('SOCIAL_DISABLE_PUBLICATION') == '1'
    media = prepare(payload.get('media_path') or payload.get('image_path'), platform)
    message = payload.get('message')
    if not isinstance(message, str) or not message.strip():
        raise ValueError('Opslagsteksten er tom.')
    if len(message) > {'instagram': 2200, 'linkedin': 3000, 'facebook': 60000}[platform]:
        raise ValueError('Opslagsteksten er for lang til platformen.')
    if dry_run:
        return {'success': True, 'published': False, 'dry_run': True, **media}
    payload = dict(payload)
    payload.setdefault('run_id', 'manual-' + uuid.uuid4().hex)
    key = hashlib.sha256((platform + ':' + str(payload['run_id'])).encode()).hexdigest()
    receipt_path = RUNTIME / ('receipt-' + key + '.json')
    RUNTIME.mkdir(parents=True, exist_ok=True, mode=0o700)
    with open(RUNTIME / (platform + '.lock'), 'a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        publisher = Publisher(platform, payload, media, upload_only)
        if not upload_only and receipt_path.exists():
            result = json.loads(receipt_path.read_text())
            log_history(platform, payload, media, result)
            if publisher.pending_path.exists():
                pending = json.loads(publisher.pending_path.read_text())
                if pending.get('run_id') == payload['run_id']:
                    publisher.pending_path.unlink()
            return {**result, 'already_published': True}
        if publisher.pending_path.exists() and not upload_only:
            raise RuntimeError('Et tidligere publiceringsforsog har ukendt resultat. Kontroller kontoen for at undgaa dobbeltopslag.')
        result = getattr(publisher, platform)()
        result.update(success=True, published=not upload_only, platform=platform,
                      media_id=media['media_id'], run_id=payload['run_id'])
        if upload_only:
            atomic_json(RUNTIME / ('upload-test-' + key + '.json'), result)
        else:
            atomic_json(receipt_path, result)
            log_history(platform, payload, media, result)
            publisher.pending_path.unlink(missing_ok=True)
        return result


def main(platform=None):
    parser = argparse.ArgumentParser()
    if platform is None:
        parser.add_argument('--platform', required=True, choices=tuple(HISTORY))
    parser.add_argument('--payload')
    parser.add_argument('--file')
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--upload-only', action='store_true')
    args = parser.parse_args()
    platform = platform or args.platform
    try:
        if args.file:
            if not (args.dry_run or args.upload_only):
                raise ValueError('--file kraever --dry-run eller --upload-only.')
            payload = {'message': 'Teddy Apps - teknisk medietest. https://mohnsen12.github.io/teddy-apps/', 'media_path': args.file}
        else:
            prefix = {'facebook': 'fb', 'instagram': 'ig', 'linkedin': 'li'}[platform]
            payload = json.loads(Path(args.payload or f'/tmp/{prefix}_post_payload.json').read_text())
        upload_only = args.upload_only or (platform == 'facebook' and os.environ.get('FB_PUBLISHED') in ('false', '0'))
        print(json.dumps(run(platform, payload, args.dry_run, upload_only), ensure_ascii=False))
        return 0
    except Exception as error:
        print(json.dumps({'success': False, 'error': redact(error)}, ensure_ascii=False))
        return 1


if __name__ == '__main__':
    raise SystemExit(main())
