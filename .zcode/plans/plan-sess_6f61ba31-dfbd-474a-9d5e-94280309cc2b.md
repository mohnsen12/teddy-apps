# Plan: Sociale medier-profiler + Fiverr for Teddy Apps

Jeg opretter en ny `marketing/`-mappe i repoet med **5 færdige, selvstændige CODEX-prompts** plus et brand-kit. Hver prompt indeholder al tekst skrevet færdig på dansk (bio-beskrivelser, About-tekster, gig-tekster m.m.), alle feltværdier, billeddimensioner og trin-for-trin-instruktioner — så du bare kopierer dem én ad gangen ind i CODEX i den rigtige rækkefølge.

## Filer jeg laver

1. **`marketing/README.md`** — rækkefølge + afhængigheder (FB-side SKAL oprettes før Instagram, osv.)
2. **`marketing/brand-kit.md`** — fælles kildetekst: navn, tagline ("Vi får Business Central til at arbejde for din virksomhed!"), farver (#0a0a0a / #ff6b35), 3 service-beskrivelser, hashtags, kontaktinfo (kontakt@teddyapps.dk, teddyapps.dk)
3. **`marketing/prompt-01-facebook.md`** — opret Facebook-side (kategori "Software Company", username @teddyapps med fallbacks, About-tekst på dansk skrevet færdig, cover-billede-brief i brand-stilen 851×315, kobl domæne + e-mail)
4. **`marketing/prompt-02-instagram.md`** — Instagram professionel konto koblet til FB-siden, bio (max 150 tegn, skrevet færdig), link til teddyapps.dk, visuel stilguide (mørk baggrund, orange accenter, Plus Jakarta Sans) + brief til de første 9 grid-kort
5. **`marketing/prompt-03-linkedin.md`** — LinkedIn-firmaprofil: tagline (120 tegn), About (2.000 tegn, skrevet færdig), industry/specialties, logo 300×300 + cover 1128×191 (baseret på og-image.png-stilen), CTA-knap, første 3 indlæg klar
6. **`marketing/prompt-04-api-automation.md`** — den tekniske del:
   - **Meta-app** (developers.facebook.com) med `pages_manage_posts`, `pages_read_engagement`, `instagram_content_publish` + **System User-token** (udløber aldrig) via Business Manager
   - **IG-publicering via Graph API**: 1080×1080 kort genereres af postens headline (Python/PIL, brand-farver), hostes på GitHub Pages så Graph API kan hente URL'en, derefter to-trins `media` → `media_publish`
   - **LinkedIn-app** med "Share on LinkedIn"-produktet; vigtig caveat jeg beskriver: posting **som firma** kræver LinkedIn-godkendelse af "Community Management API" (uger) — fallback er posting som Claus' personlige profil via API, eller LinkedIn's indbyggede planlægning indtil approval
   - **`scripts/publish.py`**: læser godkendte posts fra `content/posts/`, laver platform-varianten (LinkedIn = fuld tekst, FB = samme minus hashtag-væg, IG = kort caption + kort), poster via API'erne, logger til `content/published-log.json`, sender Telegram-bekræftelse til Claus — koblet på jeres eksisterende cron + Telegram-godkendelsesflow. Tokens i `.env` (ikke committet)
   - Rate limits er ikke et problem: 3 posts/uge mod limit på ~25/døgn
7. **`marketing/prompt-05-fiverr.md`** — dansk sælgerprofil + **3 gigs på dansk** med titel, beskrivelse, Basic/Standard/Premium-prislag, FAQ, requirements og SEO-tags:
   - "Jeg udvikler skræddersyede Microsoft Business Central apps og AL extensions"
   - "Jeg integrerer Business Central med Shopify, WooCommerce og andre systemer"
   - "Jeg bygger B2B-kundeportal med direkte integration til Business Central"
   - Galleri-billeder (1280×769) i brand-stilen; note om at Fiverr kræver oprettelse i Claus' navn (ingen API)

## Indholdsmotor (genbruger det I allerede har)

De 22 færdige danske posts i `content/posts/` bruges som startbuffer: de første 2-3 uger planlægges ved go-live, og `publish.py` fortsætter jeres eksisterende 3x/uge-rytme (man/tors/lør kl. 08:00 pr. `content/config.json`).

## Efter siderne er live (skal jeg gøre bagefter)

- Opdatere `index.html`: erstat det generiske "Find os på LinkedIn"-link med rigtig side-URL og tilføj IG/FB-link (jeg gør det, når du deler URL'erne)

## Andre forslag (ikke i denne runde — sig til hvis du vil have dem med)

- **Google Business Profile** (gratis, lokal synlighed) — jeg kan skrive en prompt-06
- **Claus' personlige LinkedIn-profil** opdateres til "Founder @ Teddy Apps" og deler firma-posts — personlige profiler får markant mere rækkevidde end firmasider

Jeg opretter ingen konti selv — alt konti-arbejde går via CODEX-prompts. Er du OK med det, laver jeg alle 7 filer nu.