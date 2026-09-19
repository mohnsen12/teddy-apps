# Teddy Apps — Sociale medier & Fiverr (CODEX-prompts)

Denne mappe indeholder færdige, selvstændige prompts til CODEX, der opretter vores
sociale profiler (LinkedIn / Instagram / Facebook), Fiverr-gigs og den fulde
API-baserede auto-posting-pipeline. **Alle tekster er skrevet færdige** — CODEX
skal "bare" oprette siderne og indtaste dem de rigtige steder.

`brand-kit.md` er single source of truth for brand, farver, tekster og hashtags.

## Rækkefølge (vigtigt pga. afhængigheder)

| # | Fil | Skaber | Forudsætninger |
|---|-----|--------|----------------|
| 1 | `prompt-01-facebook.md` | Facebook-side | Claus' private Facebook-login (2FA) |
| 2 | `prompt-02-instagram.md` | Instagram-profil | Prompt 01 (FB-siden SKAL findes først — IG kobles til den) |
| 3 | `prompt-03-linkedin.md` | LinkedIn-firmaprofil | Claus' LinkedIn-login. Kan køre parallelt med 1–2 |
| 4 | `prompt-04-api-automation.md` | Auto-posting via Meta Graph API + LinkedIn API | Prompt 01, 02 og 03 skal være færdige |
| 5 | `prompt-05-fiverr.md` | Fiverr-profil + 3 gigs på dansk | Intet. Kan køre når som helst |

## Sådan bruger du den

1. Åbn en prompt-fil og kopiér **alt indhold i den store kodeblok** ("PROMPT TIL CODEX").
2. Indsæt blokken i CODEX som én besked, og lad den arbejde.
3. CODEX pauser automatisk, når der skal tastes kodeords-/2FA-godkendelser — det må
   kun Claus gøre (login, SMS-app-koder, ID-verificering).
4. Notér de endelige usernames/URL'er, CODEX rapporterer tilbage (især hvis en
   fallback-handle blev brugt).
5. Når **alle** sider er oprettet: giv URL'erne til ZCode — så opdateres
   `index.html` ("Find os på LinkedIn"-knappen + footer) med de rigtige links.

## Handles vi sigter efter (fallbacks står i hver prompt)

- Facebook: `facebook.com/teddyapps`
- Instagram: `@teddyapps`
- LinkedIn: `linkedin.com/company/teddy-apps`

## Kendte begrænsninger (godt at vide på forhånd)

- **LinkedIn-firma-posting via API** kræver at LinkedIn godkender produktet
  "Community Management API" (kan tage uger og er ikke garanteret). Indtil da poster
  vi automatisk som Claus' personlige profil via API — det giver i øvrigt markant
  mere rækkevidde end firmasider. Detaljer og fallback i prompt 04.
- **Fiverr har ingen API** — kontoen oprettes i Claus' navn med ID-verificering.
- **teddyapps.dk skal være live**, når LinkedIn/Facebook skal godkende hjemmeside-feltet.
  Er domænet ikke aktivt endnu, bruges GitHub Pages-URL'en midlertidigt
  (`https://mohnsen12.github.io/teddy-apps/`).
- Instagram-publicering via API kræver offentligt tilgængelige billed-URL'er —
  prompt 04 løser det ved at hoste de genererede billeder her på GitHub Pages.
