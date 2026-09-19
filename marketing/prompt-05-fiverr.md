# Prompt 05 — Fiverr-profil + 3 gigs

> [!NOTE]
> En komplet opdateret engelsk/dansk opsætningsguide med copy-paste tekster til alle tre gigs og mapping af de færdige 1280×769 px billeder findes i [fiverr-setup-guide.md](file:///Users/teddy/teddy-apps/marketing/fiverr-setup-guide.md).
> Alle gig-billeder ligger klar i [marketing/assets/fiverr/](file:///Users/teddy/teddy-apps/marketing/assets/fiverr/).

**Brug:** Kopiér hele kodeblokken nedenfor ind i CODEX som én besked, eller følg [fiverr-setup-guide.md](file:///Users/teddy/teddy-apps/marketing/fiverr-setup-guide.md) direkte.
**Forudsætning:** Ingen. Kan køre parallelt med prompt 01–04.
**Vigtigt:** Fiverr har ingen API og kræver en rigtig person som sælger — kontoen
oprettes i **Claus' navn** med ID-verificering (Claus skal selv godkende).

````text
PROMPT TIL CODEX — Opret Fiverr-sælgerprofil og 3 gigs for Teddy Apps (på DANSK)

KONTEKST
Teddy Apps er en dansk specialistvirksomhed i Microsoft Business Central (BC):
integrationer (Shopify/WooCommerce/CRM/bank), custom BC-apps (AL-extensions) og
B2B-kundeportaler i PHP. Målgruppen på Fiverr er primært danske SMV'er; al
kommunikation kan også foregå på engelsk. Brandfarver: sort (#0a0a0a) og orange
(#ff6b35). Brand-detaljer: /Users/teddy/teddy-apps/marketing/brand-kit.md

Du arbejder i fiverr.coms webgrænseflade. Kontoen oprettes i Claus' navn —
PAUS ved e-mail-verifikation, telefonnummer og ID-verificering (Claus skal gøre
det selv). 

HÅRD REGEL (Fiverr TOS): INGEN e-mailadresser, telefonnumre eller eksterne links
i profilbeskrivelse, gig-tekster, billeder eller FAQ. Fiverr afviser/spærrer det.
Alt kundekontakt foregår via Fiverr-chat. Billederne må heller ikke indeholde
kontaktinfo.

DEL 1 — SÆLGERPROFIL
1. Opret konto med Claus' e-mail. Brugernavn: teddyapps
   (fallbacks: teddy_apps → teddyappsdk. NOTÉR det endelige.)
2. Visningsnavn: Claus + efternavn efter Claus' valg (Fiverr kræver et personnavn;
   "Teddy Apps" fremgår af beskrivelsen og billederne).
3. Profilbeskrivelse (≤600 tegn):
   Vi er en dansk specialistvirksomhed i Microsoft Dynamics 365 Business Central. Vi bygger integrationer (Shopify, WooCommerce, CRM, bank), skræddersyede BC-apps i AL og B2B-kundeportaler i PHP — altid med direkte, tovejs-synkronisering til BC. Standardintegrationer leveres typisk på 2-4 uger. Fast pris, klar plan og dansk support hele vejen. Svarer hurtigt — skriv, også før du bestiller.
4. Skills (tilføj disse): Microsoft Dynamics 365 Business Central · AL ·
   ERP-integration · API-integration · Shopify · WooCommerce · PHP ·
   Webudvikling · Microsoft Dynamics NAV
5. Sprog: Dansk (modersmål) · Engelsk (flydende)
6. Uddannelse/certifikater: tilføj hvis Claus har Microsoft-certificeringer
   (pause og spørg).
7. Profilbillede: brug det kvadratiske logo (marketing/assets/) ELLER helst et
   neutralt foto af Claus — ansigter konverterer bedre på Fiverr. Spørg Claus.
8. Sælgernes svar-SLA: vælg "Svarer inden for få timer".

DEL 2 — GIG 1: Custom BC-apps og AL-extensions
- Titel: Jeg udvikler skræddersyede Microsoft Business Central apps og AL extensions
- Kategori: Programming & Tech → Software Development → vælg den underkategori,
  der matcher ERP/CRM (fx "ERP & CRM Software" — tætteste match vinder)
- Metadata: Platform: Microsoft Dynamics 365 · Sprog: AL
- Søgeord/tags (5): business central · dynamics 365 · al development · erp · navision
- Gig-beskrivelse (≤1.200 tegn):
  Bruger I Microsoft Dynamics 365 Business Central — og går der ting stille og roligt lige nu? Fakturaer, der venter på godkendelse? Manuelle rutiner, som systemet burde klare?

  Jeg udvikler skræddersyede BC-apps og AL-extensions, så Business Central arbejder efter JERES processer — ikke omvendt.

  DET BYGGER JEG:
  • Custom workflows og godkendelser (beløbsgrænser, stedfortrædere, ruter)
  • Specialiserede sider, felter og lister
  • Automatisering af manuelle processer
  • Rapporter og dashboards
  • Event subscribers og afgrænsede tilpasninger

  SÅDAN ARBEJDER VI:
  1. Vi afklarer jeres proces og nuværende opsætning
  2. Udvikling i sandbox — I kan følge med hele vejen
  3. Test og fejlretning
  4. Go-live i jeres produktion — kildekoden følger altid med

  Levering som AL-app til BC cloud (SaaS). Skriv til mig, INDEN du bestiller — så rammer vi det rette scope og den rette pris første gang.

- Prislag (USD — forslag, Claus justerer; Fiverr tager 20%):
  · BASIC "Lille tilpasning" — $350 / 5 dage / 1 revision: én afgrænset tilpasning
    (fx ny side, feltlogik eller mindre workflow-ændring)
  · STANDARD "Workflow & godkendelser" — $1.200 / 14 dage / 2 revisioner:
    komplet godkendelsesworkflow med beløbsgrænser og stedfortrædere
  · PREMIUM "Custom BC-app" — $3.000 / 30 dage / 3 revisioner: fuld extension —
    sandbox-udvikling, test, go-live, kildekode + 14 dages support
- Extras: hurtigere levering (+25%) · ekstra revision (+$100) · 30 dages
  udvidet support (+$250)
- FAQ (skriv som Q/A):
  · Udvikler I i vores eget miljø? — Ja. Udvikling sker i sandbox; go-live sker
    i jeres produktion med jer ved hånden.
  · Får vi kildekoden? — Ja, AL-kildekoden leveres altid som del af opgaven.
  · Kan I tage over vedligeholdelsen af en eksisterende løsning? — Ja, skriv en
    besked med detaljer, så laver vi et tilbud.
  · Hvilke versioner understøtter I? — BC cloud (SaaS) som standard; on-prem og
    ældre NAV-versioner efter aftale.
  · Hvordan starter vi? — Send en besked med jeres nuværende opsætning og ønsker.
- Requirements-formular (det køberen udfylder ved bestilling):
  1) Beskriv hvad I gør i dag, og hvad der skal ske i stedet
  2) BC-version (cloud SaaS eller on-prem + version)
  3) Screenshots/dokumentation af det berørte område
  4) Ønsket deadline

DEL 3 — GIG 2: Integrationer
- Titel: Jeg integrerer Business Central med Shopify, WooCommerce og andre systemer
- Kategori: Programming & Tech → Software Development (ERP/CRM underkategori)
- Søgeord/tags (5): business central · shopify integration · woocommerce ·
  erp integration · api integration
- Gig-beskrivelse (≤1.200 tegn):
  Manuelt dobbeltarbejde mellem Business Central og jeres webshop, CRM eller bank? Ordrer, der tastes ind to gange? Lagerstatus, der ikke passer?

  Jeg bygger broen mellem BC og jeres andre systemer, så data flyder automatisk — begge veje.

  DET BYGGER JEG:
  • BC ↔ Shopify / WooCommerce: varer, lager, priser, ordrer og kunder synkroniseret
  • BC ↔ CRM (fx HubSpot) og andre systemer med API
  • Bank- og betalingsintegrationer
  • Automatisk ordrehåndtering med fejlhåndtering og notifikationer

  Hvis systemet har et API, kan jeg typisk bygge broen.

  SÅDAN ARBEJDER VI:
  1. Afklaring: systemer, datastrømme og krav
  2. Design af synkroniseringsmodellen (hvad synkroniseres, hvor tit, hvad vinder ved konflikt)
  3. Udvikling og test i sandbox
  4. Go-live og overvågning

  Standardintegrationer er typisk live på 2-4 uger. Skriv til mig inden bestilling — så rammer vi rigtigt scope og pris første gang.

- Prislag:
  · BASIC "Én datastrøm" — $500 / 7 dage / 1 revision: fx ordrer fra webshop
    automatisk ind i BC
  · STANDARD "Fuld webshop-sync" — $2.500 / 21 dage / 2 revisioner: varer,
    lager, priser, ordrer og kunder — begge veje
  · PREMIUM "Multi-integration" — $5.000 / 40 dage / 3 revisioner: flere
    systemer, fejlhåndtering, notifikationer + 30 dages support
- Extras: hurtigere levering (+25%) · ekstra integrationer efter aftale
- FAQ:
  · Hvilke systemer kan I koble på BC? — Alt med et API: Shopify, WooCommerce,
    Magento, CRM-systemer, banker m.fl.
  · Synkroniserer I begge veje? — Ja, vi designer retningen pr. datatype sammen.
  · Hvad med fejl — hvad sker der, hvis API'et er nede? — Fejlhåndtering med
    notifikationer og retry indbygget.
  · Kan vi starte mindre? — Ja, Basic er netop én afgrænset datastrøm.
- Requirements:
  1) Hvilke systemer skal kobles (navne + versioner)?
  2) Hvilke data, og i hvilken retning?
  3) API-adgang/dokumentation (kan deles senere i chatten)
  4) Omtrentlige datamængder (ordrer/dag, varer/antal)

DEL 4 — GIG 3: B2B-kundeportal
- Titel: Jeg bygger B2B-kundeportal med direkte integration til Business Central
- Kategori: Programming & Tech → Website Development (custom websites)
- Søgeord/tags (5): b2b portal · customer portal · business central ·
  webudvikling · php
- Gig-beskrivelse (≤1.200 tegn):
  Lad jeres B2B-kunder betjene sig selv — så de slipper telefonen, og I slipper de manuelle rutiner.

  Jeg bygger en B2B-kundeportal i PHP med direkte, tovejs-integration til Microsoft Business Central.

  FUNKTIONER (tilpasses jeres behov):
  • Login til jeres B2B-kunder
  • Realtids lagerstatus og priser — også kundepecifikke aftalepriser
  • Ordrestatus og ordrehistorik direkte fra BC
  • Genbestilling af tidligere ordrer på få klik
  • Ordrer oprettes direkte i BC — uden manuelt tastearbejde

  SÅDAN ARBEJDER VI:
  1. Afklaring: kunder, data og funktioner
  2. Design af portal og dataflows til BC
  3. Udvikling og test
  4. Go-live og oplæring

  En portal er typisk live på 4-8 uger afhængigt af scope. Skriv til mig inden bestilling, så lægger vi en plan sammen.

- Prislag (BEMÆRK: Fiverr tillader maks. 60 dages levering — hold dig under):
  · BASIC "Portal-MVP" — $3.500 / 21 dage / 1 revision: login, lagerstatus og
    ordrestatus fra BC
  · STANDARD "Fuld portal" — $7.000 / 40 dage / 2 revisioner: + aftalepriser,
    ordrehistorik, genbestilling, ordrer direkte i BC
  · PREMIUM "Portal + oplæring" — $12.000 / 60 dage / 3 revisioner: admin-flade,
    tilpasninger, oplæring + 30 dages support
- FAQ:
  · Kan kunderne se deres egne aftalepriser? — Ja, priserne hentes direkte fra BC.
  · Bygger I i vores design? — Ja, vi matcher jeres grafiske identitet.
  · Hvem hoster portalen? — Efter aftale; vi hjælper med opsætning og drift.
  · Kan portalen udvides senere? — Ja, arkitekturen er bygget til at vokse.
- Requirements:
  1) Ca. antal B2B-kunder der skal have adgang
  2) Ønskede funktioner (rangér 1-5)
  3) BC-version og eventuelle eksisterende integrationer
  4) Designpræferencer/logo

DEL 5 — GIG-BILLEDER (3 pr. gig + optional video)
1280×769 px hver, i brand-stilen (sort #0a0a0a baggrund, orange #ff6b35 accenter,
tynd orange bjælke øverst, Plus Jakarta Sans). INGEN kontaktinfo på billederne:
- Gig 1: (1) headline-kort "Custom BC-apps — Business Central arbejder efter
  JERES processer" (2) kort med de 5 byggeklodser som ikon-række
  (3) 4-trins proceskort: Afklaring → Sandbox → Test → Go-live
- Gig 2: (1) diagram-kort: BC i midten, webshop/CRM/bank omkring med forbindelseslinjer
  (2) headline-kort "Stop dobbeltarbejdet — data flyder begge veje"
  (3) kort med "2-4 uger til live" + de 4 proces-trin
- Gig 3: (1) mockup-agtigt kort: portal-visning med lager/ordrestatus-krav i
  brand-farver (2) headline-kort "Lad B2B-kunderne betjene sig selv"
  (3) funktionskort: login · lager · priser · ordrehistorik · genbestilling
Gem alle i marketing/assets/fiverr/.

DEL 6 — AKTIVERING
- Publicér alle 3 gigs (status "Aktiv").
- Slå "Købere skal kontakte mig, før de bestiller" TIL på alle gigs (vi vil altid
  afklare scopet først).
- Tjek at gigs kan findes via søgning på tagsene ovenfor.

AFSLUTNING — RAPPORTÉR TILBAGE
- Profil-URL + alle 3 gig-URL'er
- Hvilket brugernavn der endte med at blive brugt
- Skærmbilleder af profilen og hver gig
- Eventuelle felter Fiverr afviste (fx for lang tekst) og hvad du ændrede
````

## Når CODEX er færdig

- [ ] Profil + 3 gigs offentlige og aktive
- [ ] "Kontakt før bestilling" slået til på alle gigs
- [ ] Gigs findes via søgning på tags
- [ ] Prislag gennemgået og godkendt af Claus (forslagene kan justeres)
