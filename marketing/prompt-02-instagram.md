# Prompt 02 — Opret Instagram-profil for Teddy Apps

**Brug:** Kopiér hele kodeblokken nedenfor ind i CODEX som én besked.
**Forudsætning:** Prompt 01 er færdig — Facebook-siden skal findes, fordi
Instagram-profilen kobles til den (krav for API-publicering og Business-funktioner).
Claus skal have Instagram-appen på telefonen (konto-oprettelse/app-2FA kræver den).

````text
PROMPT TIL CODEX — Opret en Instagram-profil for "Teddy Apps"

KONTEKST
Du opretter en professionel Instagram-profil (Business) for Teddy Apps — en dansk
specialistvirksomhed i Microsoft Business Central: integrationer, custom BC-apps
og B2B-kundeportaler. Målgruppe: danske SMB'er. Sprog: dansk. Farver: sort
(#0a0a0a) og orange (#ff6b35). Brand-detaljer ligger i
/Users/teddy/teddy-apps/marketing/brand-kit.md.

Kontoen skal kobles til Facebook-siden "Teddy Apps" (oprettet i prompt 01) —
det er et hårdt krav for senere API-publicering og for at administrere profilen
i Meta Business Suite.

TRIN 1 — OPRET PROFILEN SOM PROFESSIONEL KONTO
1. Instagram-appen (på Claus' telefon) → Opret konto med e-mail
   kontakt@teddyapps.dk. Bruger: teddyapps
   (fallbacks hvis optaget: teddyappsdk → teddy.apps → teddyapps_bc. NOTÉR hvilket
   der blev brugt.)
2. Konvertér til professionel konto: Indstillinger → KontoType og værktøjer →
   "Skift til professionel konto" → vælg **Business** (ikke Creator).
3. Kategori: "Softwarefirma" / "Software Company" (tætteste match).
4. Vælg "Vis" på kontaktoplysninger: e-mail kontakt@teddyapps.dk.

TRIN 2 — KOBL TIL FACEBOOK-SIDEN
1. I appen: Indstillinger → Business-værktøjer og -styring → "Tilknyttet Facebook-side"
   → vælg siden "Teddy Apps".
   (Alternativ vej: business.facebook.com → Indstillinger → Forretningsaktiver →
   Instagram-konti → Tilføj.)
2. Verificér koblingen: Facebook-sidens admin skal godkende, hvis der spørges.
3. Log ind i Meta Business Suite (business.facebook.com) og bekræft at BÅDE
   Facebook-siden OG Instagram-profilen vises under "Indbakke" / "Alle værktøjer".

TRIN 3 — PROFILTEKSTER (indtast ordret)
- Navnefelt: Teddy Apps
- Bio (≤150 tegn):
  Vi får Business Central til at arbejde for din virksomhed! 🧡 Integrationer • Custom BC-apps • B2B-portaler — dansk specialist
- Link: https://teddyapps.dk
  (Hvis domænet ikke er aktivt: https://mohnsen12.github.io/teddy-apps/ — notér det.)
- Profilfoto: brug det kvadratiske logo fra prompt 01 (marketing/assets/fb-profile.png
  / logo-filen). Skal være 320×320 px eller større.
- Story-højdepunkter (opret tomme covers i brand-stil: #0a0a0a baggrund, orange
  ikon/symbol, Plus Jakarta Sans):
  1. "Services" (🔌) 2. "Tips" (💡) 3. "Cases" (📈)

TRIN 4 — VISUEL STILGUIDE (gælder alt indhold vi poster fremover)
- Format: 1080×1080 px (feed) eller 1080×1350 px (portræt, giver mere plads).
- Margen: min. 96 px fra kant. Baggrund #0a0a0a · kort-farve #181818.
- Accent #ff6b35 · tekst #fafafa · dæmpet #8b8b8b. Font: Plus Jakarta Sans Bold.
- Signaturmotiv: tynd orange bjælke øverst og nederst (som i og-image.png).
- Typografiske kort — INGEN stock-fotos. 1–2 emojis maks. Ren, skandinavisk, mørk.
- Hvert kort slutter med "Teddy.Apps" wordmark i lille størrelse (orange punktum).

TRIN 5 — DE FØRSTE 9 GRID-INDLÆG (opret billederne nu, planlægning sker i prompt 04)
Lav 9 kort i stilguiden og gem i marketing/assets/ig-grid/ (01.png … 09.png):
1. Servicekort: "🔌 Integrationer" — "BC ↔ webshop, CRM, bank. Data flyder automatisk — uden dobbeltarbejde."
2. Servicekort: "📱 Custom BC Apps" — "Workflows, godkendelser og sider tilpasset JERES virkelighed."
3. Servicekort: "🌐 B2B-portaler" — "Lad kunderne bestille selv — med lager og priser direkte fra BC."
4. Citatkort (fra post-020): "Lager der ikke lyver — webshop og BC i sync" 
5. Citatkort (fra post-021): "Godkender du stadig fakturaer via mail?" 
6. Citatkort (fra post-022): "Få B2B-kunderne til at slippe telefonen"
7. Checklistekort: "5 tegn på at BC ikke arbejder for jer" (5 korte punkter, fx:
   manuel dobbeltindtastning · fakturaer der venter på mail-godkendelse · lagerstatus
   der skal tjekkes manuelt · kunder der ringer for ordrestatus · eksport til Excel)
8. Proceskort: "Sådan starter vi" — 1. Gratis sparemøde → 2. Tilbud & plan →
   3. Byg & test → 4. Launch & support
9. Om-kort: logo + "Ledende BC-specialister i Danmark" + teddyapps.dk

CAPTION-STIL (til alle indlæg):
- Første linje = hook (synlig før "mere"), derefter 2–4 korte linjer, derefter
  CTA "Send en besked 📩", derefter 3–5 hashtags fra brand-pool.
- Færdige captions til kort 4–6 findes i /Users/teddy/teddy-apps/content/posts/
  (post-020, post-021, post-022) — brug brødteksten, kortnet til Instagram
  (maks ~800 tegn), behold hashtags.

AFSLUTNING — RAPPORTÉR TILBAGE
- Endeligt brugernavn (@…) og profil-URL
- Bekræftelse på at profilen er koblet til Facebook-siden og synlig i Meta Business Suite
- Skærmbillede af profilen og af de 9 grid-billeder
- Eventuelle afvigelser
````

## Når CODEX er færdig

- [ ] Professionel (Business)-konto oprettet og koblet til FB-siden
- [ ] Bio + link + profilfoto på plads
- [ ] 9 grid-billeder genereret i `marketing/assets/ig-grid/`
- [ ] Synlig i Meta Business Suite (vigtigt for prompt 04)
