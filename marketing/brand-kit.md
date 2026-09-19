# Teddy Apps — Brand Kit

Single source of truth for alt brand-indhold. Alle CODEX-prompter i denne mappe
bruger præcis disse tekster og værdier. Ændres noget her, skal profilerne opdateres.

## Grundoplysninger

| Felt | Værdi |
|---|---|
| Firmanavn | Teddy Apps (logo-stil: "Teddy.Apps" med orange punktum) |
| Tagline | Vi får Business Central til at arbejde for din virksomhed! |
| Hero-badge | Ledende BC-specialister i Danmark |
| Målgruppe | Danske SMB'er der bruger Business Central |
| Sprog | Dansk |
| Tone | Professionel men tilgængelig · 70% edukativ, 30% soft CTA |
| E-mail | kontakt@teddyapps.dk |
| Website | https://teddyapps.dk (midlertidigt: https://mohnsen12.github.io/teddy-apps/) |
| Område | Danmark |

## Visuel identitet

- Baggrund `#0a0a0a` · Sekundær `#121212` · Kort `#181818`
- Accent (orange) `#ff6b35` (hover `#ff8555`)
- Tekst `#fafafa` · Dæmpet tekst `#8b8b8b` · Kant `#2a2a2a`
- Typografi: **Plus Jakarta Sans** (Bold til overskrifter)
- Signaturmotiv: tynde orange bjælker øverst og nederst (som i `og-image.png`)
- Emojis: maks. 1–2 pr. opslag · Service-ikoner: 🔌 Integrationer · 📱 Custom BC Apps · 🌐 PHP & Web

Eksisterende brand-asset: `og-image.png` (1200×630, sort med orange bjælker).
Der findes **ikke** et kvadratisk logo endnu — prompterne specificerer det.

## Services (ordlyd fra teddyapps.dk)

1. 🔌 **Integrationer** — "Synkroniser BC med din webshop, CRM, bank eller andre
   systemer. Vi bygger bro mellem systemerne, så data flyder automatisk — uden
   manuelt dobbeltarbejde." (FAQ: Shopify, WooCommerce, Magento, CRM, bank,
   B2B-portaler — "Hvis systemet har et API, kan vi typisk bygge broen.")
2. 📱 **Custom BC Apps** — "Skræddersyede apps og extensions til Business Central.
   Tilpas workflows, opret specialiserede sider, og automatisér processer der er
   unikke for din virksomhed." (Godkendelser, beløbsgrænser, stedfortrædere.)
3. 🌐 **PHP & Web** — "Hjemmesider, webshops og portaler bygget i PHP. Vi kobler dem
   direkte sammen med BC, så kunder, varer og ordrer altid er opdateret — begge
   veje." (Primært B2B-kundeportaler med realtids lager/ordrestatus og aftalepriser.)

## Process & løfter

- 4 trin: **Gratis sparemøde → Tilbud & plan → Byg & test → Launch & support**
- Levering: standardintegrationer live på **2–4 uger** · custom apps og større
  portaler **4–12 uger**
- USP'er: 100% skræddersyede løsninger · Dansk support — på dit sprog · Hurtig værdi
- CTA'er: "Book et gratis sparemøde →" / "Send en besked"

## Hashtags (fast pool)

`#BusinessCentral` `#Dynamics365` `#Automatisering` `#Workflow` `#DanskeSMB`
`#Shopify` `#WooCommerce` `#Ecommerce` `#MicrosoftDynamics` `#Danmark`

## Klare korte tekster (genbruges ordret i prompterne)

**Instagram-bio (≤150 tegn):**
```
Vi får Business Central til at arbejde for din virksomhed! 🧡 Integrationer • Custom BC-apps • B2B-portaler — dansk specialist
```

**Facebook-kort bio (≤101 tegn):**
```
Vi får Business Central til at arbejde for din virksomhed! Integrationer, apps og B2B-portaler.
```

**Facebook-beskrivelse (≤255 tegn):**
```
Teddy Apps hjælper danske SMB'er med at få mere ud af Microsoft Business Central: integrationer til webshop og CRM, skræddersyede BC-apps og B2B-kundeportaler. Gratis sparemøde — og altid dansk support.
```

**LinkedIn tagline (≤120 tegn):**
```
Vi får Business Central til at arbejde for din virksomhed — integrationer, custom apps og B2B-portaler.
```

**LinkedIn About-teksten er for lang til dette kit — den står komplet i `prompt-03-linkedin.md`.**

## Kontekst til indholdsproduktionen

- 22 færdige danske posts ligger i `content/posts/` (post-001 … post-022) og er
  startbufferen for alle platforme.
- Format pr. post (se `post-021`): hook-spørgsmål → 2–3 ✅-punkter med værdi →
  brandlinjen "Vi får Business Central til at arbejde for din virksomhed!" →
  soft CTA → 3–5 hashtags.
- Rytme: **3x/uge — mandag, torsdag, lørdag kl. 08:00** (jf. `content/config.json`).
- Emne-rotation: Integrationer → Custom BC Apps → PHP & Web/B2B-portal.
