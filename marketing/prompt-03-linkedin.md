# Prompt 03 — Opret LinkedIn-firmaprofil for Teddy Apps

**Brug:** Kopiér hele kodeblokken nedenfor ind i CODEX som én besked.
**Forudsætning:** Claus' private LinkedIn-konto (firmaprofiler oprettes altid fra en
personlig profil). Kan køre parallelt med prompt 01–02.
**Bemærk:** LinkedIn-verificering af hjemmeside kræver, at teddyapps.dk er live —
eller brug GitHub Pages-URL'en midlertidigt.

````text
PROMPT TIL CODEX — Opret LinkedIn-firmaprofil for "Teddy Apps"

KONTEKST
Du opretter en LinkedIn-firmaprofil (Company Page) for Teddy Apps — en dansk
specialistvirksomhed i Microsoft Business Central: integrationer, custom BC-apps
og B2B-kundeportaler i PHP. Målgruppe: danske SMB'er. Sprog: dansk. Brandfarver:
sort (#0a0a0a) og orange (#ff6b35). Brand-detaljer:
/Users/teddy/teddy-apps/marketing/brand-kit.md

Log ind med Claus' personlige LinkedIn-konto. PAUSER ved 2FA/verifikationskoder —
Claus godkender. Firmaprofilen oprettes fra en personlig profil, så Claus bliver
automatisk super admin — det er korrekt.

TRIN 1 — OPRET SIDEN
1. Gå til linkedin.com/company-setup/ (eller "For virksomheder" → "Opret en
   virksomhedsside") → vælg "Virksomhed" (ikke visningsside).
2. Udfyld:
   - Navn: Teddy Apps
   - Officiel hjemmeside: https://teddyapps.dk
     (Hvis domænet ikke er aktivt endnu: https://mohnsen12.github.io/teddy-apps/
     — notér at vi retter det senere.)
   - Branche: "IT-tjenester og IT-rådgivning" / "IT Services and IT Consulting"
   - Firmatype: "Selvejende virksomhed" / "Privately Held"
   - Størrelse: 2-10 medarbejdere
   - Land: Danmark (by: skip/udfyld efter Claus' ønske)
3. URL-slug: vælg teddy-apps (giver linkedin.com/company/teddy-apps).
   Fallback: teddyapps. NOTÉR den endelige URL.

TRIN 2 — TAGLINE, OM OG SPECIALER (indtast ordret)
- Tagline (≤120 tegn):
  Vi får Business Central til at arbejde for din virksomhed — integrationer, custom apps og B2B-portaler.

- "Om os" (≤2.000 tegn):
  Vi får Business Central til at arbejde for din virksomhed!

  Teddy Apps er en dansk BC-specialist, der hjælper SMB'er med at få mere ud af Microsoft Dynamics 365 Business Central. De fleste virksomheder bruger kun en brøkdel af systemet — og bruger timer hver uge på manuelt dobbeltarbejde mellem BC, webshop, CRM og mail. Det retter vi på.

  HVAD VI GØR

  🔌 Integrationer — Vi synkroniserer BC med webshop, CRM, bank eller andre systemer, så data flyder automatisk. Hvis systemet har et API, kan vi typisk bygge broen.

  📱 Custom BC Apps — Skræddersyede apps og extensions: workflows og godkendelser med beløbsgrænser og stedfortrædere, specialiserede sider og automatisering af jeres unikke processer.

  🌐 PHP & Web — Hjemmesider, webshops og især B2B-kundeportaler bygget i PHP og koblet direkte på BC, så kunder, varer og ordrer altid er opdaterede — begge veje.

  SÅDAN ARBEJDER VI

  1️⃣ Gratis sparemøde — vi finder jeres største tidsrøvere
  2️⃣ Tilbud & plan — fast pris og klar plan
  3️⃣ Byg & test — I følger med hele vejen
  4️⃣ Launch & support — vi er der også efter go-live

  Standardintegrationer er typisk live på 2-4 uger. Custom apps og større portaler på 4-12 uger. Alt foregår på dansk — med dansk support.

  💬 Skriv til os her på LinkedIn eller på kontakt@teddyapps.dk, og book et gratis sparemøde.

- Specialer (tilføj som enkelt-tags, ét ad gangen):
  Business Central · Dynamics 365 · ERP-integration · AL-udvikling ·
  Shopify-integration · WooCommerce-integration · B2B-kundeportaler ·
  Workflow-automatisering · PHP-udvikling · Webshops

TRIN 3 — LOGO OG COVER (generér billederne i brand-stil)
A) Logo, kvadratisk — lever 1024×1024 PNG (LinkedIn skalerer til 300×300):
   - Baggrund #0a0a0a, tynd orange (#ff6b35) bjælke langs øverste kant.
   - "Teddy.Apps" wordmark i Plus Jakarta Sans Bold, hvid, med ORANGE punktum
     efter "Teddy". (Fallback: stort orange "T." monogram.)
   - Læsbar ved 60×60 px. Gem som marketing/assets/li-logo.png.

B) Coverbillede 1128×191 px (LinkedIn-firmaformat, meget tyndt!):
   - Baggrund #0a0a0a med orange bjælke langs hele øverste kant (4–6 px).
   - Venstre: "Teddy.Apps" wordmark. Midt/højre: taglinjen i hvid, én linje.
   - INGEN andet — det bliver skåret af i mobilvisning. Gem som
     marketing/assets/li-cover.png.
   Font: Plus Jakarta Sans (gem .ttf i marketing/assets/fonts/ hvis ikke allerede
   gjort i prompt 01).

TRIN 4 — CTA OG INDSTILLINGER
- CTA-knap på siden: "Kontakt os" → https://teddyapps.dk
  (hvis domænet ikke er live: spring over, aktiveres senere).
- Sprog for siden: Dansk.
- Tilføj en ekstra admin (anbefalet backup): Claus tilføjer en anden person som
  admin når som helst — pause her og spørg Claus.
- "Find os på LinkedIn"-knappen på vores website peger i dag generisk — NOTÉR
  at URL'en skal sendes tilbage, så den rettes.

TRIN 5 — DE FØRSTE 3 OPSLAG (som FIRMAPROFIL)
Indholdet er allerede skrevet. Opret 3 opslag med brødteksten (uden metadata-
headeren og uden "---"-linjerne) fra disse filer:
1. /Users/teddy/teddy-apps/content/posts/post-020-integrationer-bc-shopify-woocommerce-sync.md
2. /Users/teddy/teddy-apps/content/posts/post-021-bc-apps-custom-workflows-godkendelsesprocesser.md
3. /Users/teddy/teddy-apps/content/posts/post-022-php-web-b2b-portal-bc.md
- Behold emojis, ✅-punkter, brandlinjen, CTA og hashtags fra hver fil.
- Vedhæft /Users/teddy/teddy-apps/og-image.png som billede på hvert opslag.
- Publicér opslag 1 nu. Opslag 2 og 3 planlægges 3 og 6 dage frem (kl. 08:00) via
  LinkedIn's indbyggede planlægningsfunktion (ur-ikonet i opslagsfeltet).
- Pin opslag 1 øverst på siden ("Fremhæv øverst").

TRIN 6 — CLAUS' PERSONLIGE PROFIL (vigtig for rækkevidde)
- Opdater Claus' headline til:
  "Founder & BC-udvikler @ Teddy Apps | Vi får Business Central til at arbejde for din virksomhed"
- Tilføj erfaring-post: "Founder" hos Teddy Apps, med kort beskrivelse (tagline +
  de 3 services) og link til firma-siden.
- Slå "Creator-tilstand" til hvis headline skal kunne indeholde følger-CTA.
- Firma-opslag delges/repostes fra den personlige profil (gøres løbende —
  nævnes i rapporten som rutine).

AFSLUTNING — RAPPORTÉR TILBAGE
- Firmaprofilens endelige URL
- Skærmbilleder: sideforside, "Om", logo/cover, de 3 opslag
- Bekræftelse på at Claus er super admin
- Eventuelle afvigelser eller felter LinkedIn afviste
````

## Når CODEX er færdig

- [ ] Firmaprofil offentlig på `linkedin.com/company/teddy-apps` (eller fallback)
- [ ] Tagline, About og specialer udfyldt med brand-teksterne
- [ ] Logo (300×300) + cover (1128×191) uploadet
- [ ] 3 opslag: 1 publiceret + fastgjort, 2 planlagt
- [ ] Claus' personlige profil opdateret til "Founder @ Teddy Apps"
- [ ] URL sendt til ZCode → `index.html` opdateres
