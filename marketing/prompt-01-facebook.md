# Prompt 01 — Opret Facebook-side for Teddy Apps

**Brug:** Kopiér hele kodeblokken nedenfor ind i CODEX som én besked.
**Forudsætning:** Claus' private Facebook-konto (2FA skal Claus selv godkende).
**Husk:** FB-siden SKAL oprettes, før Instagram og Meta-API'et (prompt 02 + 04).

````text
PROMPT TIL CODEX — Opret en Facebook-side for "Teddy Apps"

KONTEKST
Du opretter en professionel Facebook-virksomhedsside for Teddy Apps — en dansk
specialistvirksomhed, der udvikler Microsoft Business Central-løsninger
(integrationer, custom BC-apps og B2B-kundeportaler i PHP). Målgruppen er danske
SMB'er, sproget er dansk, og brandfarverne er sort (#0a0a0a) og orange (#ff6b35).

Du arbejder gennem Facebooks webgrænseflade (facebook.com og business.facebook.com).
Log ind med ejeren Claus' private konto. PAUSER hver gang, der kræves kodeord,
2FA-kode eller anden godkendelse — Claus overtager og giver dig lov til at fortsætte.

TRIN 1 — OPRET SIDEN
1. Gå til facebook.com/pages/create (eller "Sider" → "Opret ny side").
2. Udfyld præcis:
   - Sidenavn: Teddy Apps
   - Kategori: "Softwarefirma" / "Software Company" (hvis den ikke findes,
     vælg det tætteste: "Computervirksomhed" eller "Internetvirksomhed").
     Tilføj op til 2 sekundære kategorier: "Webdesign" og "Computerkonsulent".

TRIN 2 — PROFILFOTO OG FORSIDEBILLEDE
Generér billederne først (fx som HTML/CSS renderet til PNG via Python/PIL eller
headless browser) i denne stil:

A) Profelfoto (kvadratisk logo) — lever som 1024×1024 PNG:
   - Baggrund #0a0a0a, tynd orange (#ff6b35) bjælke langs øverste kant.
   - Centreret wordmark "Teddy.Apps" i Plus Jakarta Sans Bold, hvid (#fafafa),
     hvor PUNKTUMMET efter "Teddy" er orange #ff6b35.
   - Alternativ hvis wordmark bliver for lille: stort "T" i orange med orange
     punktum efter.
   - Ingen andre elementer. Ren og læsbar allerede ved 40×40 px.

B) Forsidebillede (cover) — upload som 1640×624 PNG (vigtigt indhold centreret
   i midterfeltet ~1200×400, så mobil-crop ikke skærer det af):
   - Baggrund #0a0a0a, orange bjælke øverst og nederst (som omgivelsesmotivet
     i den eksisterende brand-fil /Users/teddy/teddy-apps/og-image.png).
   - Venstre: "Teddy.Apps" wordmark (orange punktum).
   - Under: taglinjen i hvid — "Vi får Business Central til at arbejde for din
     virksomhed!"
   - Nederst i række: 🔌 Integrationer · 📱 Custom BC Apps · 🌐 PHP & Web
     (tekst i #8b8b8b).
   - Ingen kontaktinfo på billedet.

Font: Plus Jakarta Sans (kan hentes fra Google Fonts, open license) — gem en kopi
af .ttf-filen i marketing/assets/fonts/ til genbrug i senere prompts.

TRIN 3 — FELTVÆRDIER (indtast ordret)
- Kort bio (≤101 tegn):
  Vi får Business Central til at arbejde for din virksomhed! Integrationer, apps og B2B-portaler.

- Beskrivelse (sektionen "Om" / kort beskrivelse, ≤255 tegn):
  Teddy Apps hjælper danske SMB'er med at få mere ud af Microsoft Business Central: integrationer til webshop og CRM, skræddersyede BC-apps og B2B-kundeportaler. Gratis sparemøde — og altid dansk support.

- Detaljeret "Om os" (lang tekst):
  Teddy Apps er en dansk specialistvirksomhed i Microsoft Dynamics 365 Business Central. Vi hjælper SMB'er med at få mere ud af det system, de allerede har — uden manuelt dobbeltarbejde.

  🔌 Integrationer: Vi synkroniserer BC med webshop (Shopify, WooCommerce m.fl.), CRM og bank, så data flyder automatisk mellem systemerne.

  📱 Custom BC Apps: Skræddersyede workflows og godkendelser — fx beløbsgrænser og stedfortrædere — specialiserede sider og automatisering af jeres unikke processer.

  🌐 PHP & Web: Hjemmesider, webshops og især B2B-kundeportaler med direkte, tovejs-integration til BC.

  Vi starter altid med et gratis sparemøde, hvor vi finder jeres største tidsrøvere. Standardintegrationer er typisk live på 2-4 uger. Alt på dansk — med dansk support.

  📩 kontakt@teddyapps.dk · 🌍 teddyapps.dk

- Hjemmeside: https://teddyapps.dk
  (Hvis domænet ikke er aktivt endnu: brug https://mohnsen12.github.io/teddy-apps/
  og notér det — vi retter det, når domænet er live.)
- E-mail: kontakt@teddyapps.dk
- Beliggenhed: spring over (vi oplyser ikke adresse). "Område": Danmark.
- Åbningstider: "Altid åben" (online-forretning) eller tom.
- Prisinterval: spring over.
- Brugernavn (klik "Opret @brugernavn"): teddyapps
  Hvis optaget, prøv i denne rækkefølge: teddyappsdk → teddy.apps → teddyapps_bc.
  NOTÉR hvilket der blev brugt.

TRIN 4 — HANDLINGSKNAP OG INDSTILLINGER
- Handlingknappen (CTA) på siden: "Send e-mail" → kontakt@teddyapps.dk
  (alternativt "Kontakt os" → https://teddyapps.dk hvis domænet er live).
- Slå beskeder (Messenger) til. Sæt autosvar/hilsen:
  "Tak for din besked! Vi svarer hurtigst muligt — typisk inden for få timer.
  Vil du spare tid? Book et gratis sparemøde, så kigger vi på, hvor Business
  Central kan tage arbejdet fra de manuelle rutiner."
- Responsmærkat: vælg realistisk ("Svarer typisk inden for få timer").
- Tjek at siden er offentlig/publiceret (ikke "ikke udgivet").

TRIN 5 — BUSINESS MANAGER (forberedelse til prompt 04)
1. Gå til business.facebook.com og opret en Business-portefølje med navnet
   "Teddy Apps" (hvis ikke den allerede findes).
2. Tilføj den nye FB-side som et asset i porteføljen.
3. Tilføj Claus som fuld admin af både siden og porteføljen.
(Det er alt — API-nøglerne selv oprettes i prompt 04.)

AFSLUTNING — RAPPORTÉR TILBAGE
- Sidens endelige URL (facebook.com/<brugernavn>)
- Hvilket brugernavn der endte med at blive brugt
- Skærmbilleder af sideforside, "Om"-sektion og profilfoto/cover
- Eventuelle felter der manglede eller afveg
Gem alle genererede billeder i marketing/assets/ (fb-profile.png, fb-cover.png)
så de kan genbruges af prompt 02, 03 og 05.
````

## Når CODEX er færdig

- [ ] Siden er offentlig med brugernavn `@teddyapps` (eller fallback)
- [ ] Profilfoto + cover uploadet
- [ ] CTA-knap virker
- [ ] Business-portefølje oprettet og siden tilføjet som asset
- [ ] URL'er noteret til senere opdatering af `index.html`
