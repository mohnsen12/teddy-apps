# Prompt 04 — Fuld API-automation: auto-posting til Facebook, Instagram og LinkedIn

**Brug:** Kopiér hele kodeblokken nedenfor ind i CODEX som én besked.
**Forudsætning:** Prompt 01 (FB-side), 02 (IG-profil koblet til siden) og 03
(LinkedIn-firmaprofil) skal være færdige. Claus skal godkende login/2FA i
Meta- og LinkedIn-konsollerne undervejs.
**Vigtigste kendetegn:** Bygger videre på den eksisterende pipeline
(`scripts/generate_draft.py` → cron-agent → Telegram-godkendelse fra Claus).

````text
PROMPT TIL CODEX — Fuld API-automatisering af indlæg for Teddy Apps

KONTEKST
Teddy Apps (dansk Microsoft Business Central-specialist) har en content-pipeline:
- scripts/generate_draft.py kører via lokal cron man/tors/lør kl. 08:00 og
  genererer et draft-JSON i content/drafts/.
- En agent skriver det færdige opslag som Markdown i content/posts/
  (post-XXX.md — format: metadata-header, derefter "---", opslagstekst,
  brandlinje, "---", hashtags).
- Claus godkender via Telegram før publicering.
I dag sker selve publiceringen manuelt. DIN OPGAVE: byg og konfigurér den fulde
automatiske publicering til Facebook-side, Instagram og LinkedIn-firma via
de officielle API'er, med udgangspunkt i de godkendte post-filer.

Repo: /Users/teddy/teddy-apps (statisk site på GitHub Pages:
https://mohnsen12.github.io/teddy-apps/ — repo-roden serveres, fx
assets/ig/post-XXX.png bliver en offentlig URL efter git push).

DEL A — META-APP OG TOKEN (Facebook + Instagram)
Trin (i developers.facebook.com og business.facebook.com — PAUS ved logins/2FA):
1. Business-porteføljen "Teddy Apps" findes allerede (prompt 01), og FB-siden
   + IG-profilen er assets i den.
2. Opret en app: developers.facebook.com → "Opret app" → type "Business" →
   navn: "Teddy Apps Publisher".
3. Tilføj produktet "Facebook Login for Business" (eller graf-API-produktet).
4. Notér App ID + App Secret (skal ind i .env — ALDRIG i git).
5. Opret en SYSTEMBRUGER i Business Settings → Brugere → Systembrugere:
   - Navn: "publisher", rolle: Admin.
   - Tildel assets: appen "Teddy Apps Publisher" + Facebook-siden + Instagram-
     kontoen (fuld adgang).
   - Generér token for systembrugeren med scopes:
     pages_show_list, pages_read_engagement, pages_manage_posts,
     instagram_basic, instagram_content_publish, business_management
   - Dette token UDLOBER IKKE. Gem som META_ACCESS_TOKEN i .env.
6. Find ID'erne via Graph API (graph.facebook.com/v21.0/):
   - Side-ID: GET /me/accounts med tokenet → notér som FACEBOOK_PAGE_ID
   - IG-ID: GET /{page-id}?fields=instagram_business_account → INSTAGRAM_USER_ID
7. Verificér adgang: GET /{page-id}/feed og GET /{ig-user-id} skal svare 200.
BEMÆRK: Fordi app-ejeren selv administrerer siden/profilen, kræves ingen fuld
App Review. App'en kan blive i Development-tilstand.

DEL B — INSTAGRAM-BILLEDER (offentlig hosting)
Graph API kræver en offentligt tilgængelig billed-URL til IG-publicering:
1. Skriv scripts/render_ig_card.py (Python + Pillow):
   - 1080×1080 JPEG (kvalitet ~90, <8 MB).
   - Baggrund #0a0a0a; orange (#ff6b35) bjælke 12 px øverst og nederst.
   - Overskrift = opslagets første linje (hook), hvid #fafafa, Plus Jakarta Sans
     Bold (brug .ttf fra marketing/assets/fonts/ — hent fra Google Fonts hvis den
     mangler; open license), automatisk linjeombrydning, maks 4 linjer / 80 tegn.
   - Footer: "Teddy.Apps" (orange punktum) + "teddyapps.dk" i #8b8b8b.
   - CLI: render_ig_card.py <post.md> <output.png>
2. Output: assets/ig/post-XXX.png i repo-roden (GitHub Pages serverer den).
3. publish.py SKAL: git add + commit + push af billedet FØR API-kaldet, og derefter
   polle billed-URL'en med HEAD indtil HTTP 200 (GitHub Pages-deploy tager typisk
   30-90 sek.; timeout 5 min). Brug SITE_BASE_URL fra .env som URL-base.
   Alternativ hvis https://teddyapps.dk er live: brug det domæne i stedet.

DEL C — LINKEDIN-APP OG TOKEN
1. developer.linkedin.com → "Opret app" → navn "Teddy Apps Publisher",
   kobles til LinkedIn-firmaprofilen (Claus er admin) og en logo-upload.
2. Anmod om produktet "Share on LinkedIn" (selvbetjening — giver w_member_social,
   dvs. posting som Claus' PERSONLIGE profil).
3. Anmod SAMTIDIGT om produktet "Community Management API"
   (w_organization_social + r_organization_social = posting som FIRMA). LinkedIn
   godkender denne med manuel review — kan tage uger og er ikke garanteret.
4. OAuth 2.0 (authorization code flow, redirect til http://localhost:8000/callback):
   - Gem LINKEDIN_ACCESS_TOKEN (60 dages levetid) og refresh-token i .env.
   - Skriv scripts/li_refresh_token.py, der fornyer tokenet via
     POST https://www.linkedin.com/oauth/v2/accessToken
     (grant_type=refresh_token) — køres via cron hver 50. dag.
5. Find URN'er:
   - Person: GET https://api.linkedin.com/v2/userinfo → sub → urn:li:person:{sub}
     (LINKEDIN_MEMBER_URN)
   - Firma (når Community Management API er godkendt):
     GET https://api.linkedin.com/rest/organizationAuthorizations?q=organizationMember
     → urn:li:organization:{id} (LINKEDIN_ORG_URN)

DEL D — scripts/publish.py (KEREN)
CLI:
  python scripts/publish.py --post content/posts/post-022-....md \
      --platforms facebook,instagram,linkedin [--dry-run] [--force]

Funktioner:
1. PARSE post-filen: metadata (Dato/Service/Topic) mellem titel og første "---";
   brødtekst mellem første og andet "---"; hashtags-sidste blok; spring
   signatur-linjen "[Teddy Apps — ...]" fra.
2. LAV PLATFORM-VARIANTER:
   - facebook: fuld brødtekst + link https://teddyapps.dk; maks 3 hashtags fra
     blokken. Markdown (** ) fjernes, ✅-punkter beholdes.
   - instagram: kort caption (maks 2.200 tegn): hook + 1-2 stærkeste ✅-punkter
     som korte linjer + brandlinjen + "Send en besked 📩" + op til 5 hashtags.
     Billede via render_ig_card.py.
   - linkedin: fuld brødtekst (markdown fjernet) + hashtags-blok.
3. IDEMPOTENS: indlæs content/published-log.json; spring platform over, hvis
   posten allerede er registreret dér (medmindre --force).
4. PUBLICÉR:
   FACEBOOK:
     POST https://graph.facebook.com/v21.0/{FACEBOOK_PAGE_ID}/feed
     med message + link. Håndter fejl-svar {"error": {...}} → log + Telegram-
     alarm, exit-kode 1.
   INSTAGRAM (to trin):
     a) POST /{INSTAGRAM_USER_ID}/media med image_url=<offentlig URL fra delcase B>
        + caption → creation_id
     b) Poll GET /{INSTAGRAM_USER_ID}/media?fields=status_code til FINISHED
        (maks 3 min) → POST /{INSTAGRAM_USER_ID}/media_publish med creation_id.
     Rate limit er ca. 50 opslag/døgn — vi poster 3/uge, intet problem.
   LINKEDIN (nyeste posts-endpoint):
     POST https://api.linkedin.com/rest/posts
     Headers: Authorization: Bearer {token} · LinkedIn-Version: 202506 (eller
     seneste stabile) · X-Restli-Protocol-Version: 2.0.0
     Body: {"author":"<URN>","commentary":"<tekst>","visibility":"PUBLIC",
            "distribution":{"feedDistribution":"MAIN_FEED","targetEntities":[],
            "thirdPartyDistributionChannels":[]},"lifecycleState":"PUBLISHED"}
     - Hvis LINKEDIN_ORG_URN er sat og tokenet har org-scope: post som FIRMA.
     - Ellers: fallback til LINKEDIN_MEMBER_URN (personlig profil) og log en
       tydelig note. (Personlige opslag giver i øvrigt størst rækkevidde.)
5. LOG: tilføj til content/published-log.json:
   {"post": "post-022-....md", "platform": "instagram", "at": "<ISO-tid>",
    "response_id": "...", "status": "ok|error", "error": null|"..."}
   Opdatér også config.json → "posted" (post-ID, som generate_draft.py bruger).
6. TELEGRAM: send bekræftelse til Claus efter kørsel:
   "✅ post-022 publiceret — FB ok · IG ok · LI som personlig profil (firma-API
   afventer godkendelse)" — eller fejl-detaljer hvis noget fejlede.
   Brug TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID fra .env (genbrug værdierne fra
   den eksisterende cron-agent hvis de findes; ellers opret bot via @BotFather).
7. --dry-run: udskriv alle 3 varianter + den genererede IG-billedsti, ingen
   API-kald, ingen git-handlinger.
8. .env-indlæsning uden eksterne afhængigheder (simpel parser) eller python-
   dotenv. Opret .env.example med alle variabler (tomme værdier + kommentarer):
   FACEBOOK_PAGE_ID, INSTAGRAM_USER_ID, META_ACCESS_TOKEN,
   LINKEDIN_ACCESS_TOKEN, LINKEDIN_REFRESH_TOKEN, LINKEDIN_MEMBER_URN,
   LINKEDIN_ORG_URN, LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET,
   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, SITE_BASE_URL
   Tilføj ".env" til .gitignore (opret .gitignore hvis den mangler).

DEL E — PLANLÆGNING (kobling på eksisterende cron)
- Rytmen ændres IKKE: man/tors/lør kl. 08:00 (content/config.json).
- Efter Telegram-godkendelse fra Claus kører cron-agenten:
    python scripts/publish.py --post content/posts/<fil>.md --platforms facebook,instagram,linkedin
- LinkedIn-firma-posting aktiveres automatisk, når Community Management API er
  godkendt (scriptet vælger selv org-URN, hvis sat).
- Test-afslutning: publicér ÉN reel test-post (fx post-022) til FB og IG, verificér
  at billed-cards ser korrekte ud, og dokumentér i slutningen af denne fil hvordan
  test-opslag slettes igen hvis ønsket.

AFSLUTNINGSKRITERIER (alle skal opfyldes)
- [ ] scripts/publish.py + scripts/render_ig_card.py + scripts/li_refresh_token.py
      virker, med samme kode-stil som scripts/generate_draft.py
- [ ] .env.example oprettet, .env i .gitignore, tokens ALDRIG i git
- [ ] --dry-run viser alle 3 platform-varianters tekst korrekt
- [ ] IG-kort renderes som 1080×1080 i brand-stil og er offentligt tilgængelige
      via GitHub Pages-URL
- [ ] Reel test-post publiceret på FB-siden og IG-profilen (bekræftet i UI)
- [ ] LinkedIn: token virker, min. 1 test-opslag via personlig profil; org-posting
      klar så snart produkt-godkendelsen kommer
- [ ] content/published-log.json oprettes; Telegram-bekræftelse modtaget
- [ ] Kort runbook til Claus i slutningen af denne fil (hvad sker der automatisk,
      hvad skal han godkende, hvordan fornys LinkedIn-tokenet)
````

## Når CODEX er færdig

- [ ] Test-post vist på FB-siden og IG-profilen
- [ ] `content/published-log.json` fyldt korrekt
- [ ] Telegram-bekræftelser lander hos Claus
- [ ] LinkedIn "Community Management API"-ansøgning sendt (afventer LinkedIn)
- [ ] Ingen tokens i git (`git log`/`git diff` tjekket)
