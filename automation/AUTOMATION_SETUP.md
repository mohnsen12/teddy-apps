# Teddy Apps social automation

Status pr. 19. september 2026 — ALLE TRE workflows er AKTIVE:

- Teddy Apps Facebook Auto-Post: **AKTIV** — mandag, onsdag og fredag kl. 14:30.
- Teddy Apps LinkedIn Auto-Post: **AKTIV** — tirsdag og torsdag kl. 15:30.
- Teddy Apps Instagram Auto-Post: **AKTIV** — dagligt kl. 20:45. Første rigtige
  test-opslag blev publiceret og verificeret på @teddyapps82 den 19. september
  2026 (media-id 18014500970944795).

Alle skemaer kører i tidszonen `Europe/Copenhagen`. n8n kører som launch
agent `ai.teddy.n8n` og henter konfiguration fra
`~/Library/LaunchAgents/ai.teddy.n8n.plist`.

## Meta-opslag (Facebook + Instagram)

- Meta-app: "Teddy Apps Publisher" (app-ID `3332251243626807`), tilknyttet
  virksomhedsporteføljen "Teddy Apps" (`28595002530183383`).
- Systembruger: "publisher" (`61594645764471`, rolle Employee) med adgang til
  Facebook-siden, Instagram-kontoen og appen.
- Facebook-side: "Teddy Apps", side-ID `1310521282144790`.
  (Det gamle ID `61594613364930` i tidligere prompts er forældet og skal ikke
  bruges; `automation/social_upload.py` er rettet i overensstemmelse hermed.)
- Instagram: professionel konto `@teddyapps82`, IG-bruger-ID
  `17841432910235196`, koblet til Facebook-siden.
- Tokens: systembruger-token gemmes som `TEDDY_META_SYSTEM_TOKEN` og
  side-tokenet som `TEDDY_FACEBOOK_PAGE_ACCESS_TOKEN`. Begge udløber ALDRIG.
  Postering (inkl. upublicerede test-opslag) skal bruge side-tokenet.
- Ikke-offentlig test: upubliceret opslag oprettet, verificeret og slettet via
  Graph API den 18. september 2026.

## LinkedIn

- Firmaprofil: linkedin.com/company/teddy-apps
  (`urn:li:organization:146603501`). Claus Stricker Jacobsen er administrator
  af siden (verificeret via admin-dashboardet den 19. september 2026).
- Posting sker indtil videre som "Teddy Bot" (`teddybot82@gmail.com`,
  `urn:li:person:aneDsUK-iD`), hvis token har `w_member_social` og er testet
  med et draft-opslag.
- Firmaposting: "Community Management API" (`w_organization_social`) er
  ansøgt til LinkedIn-appen "Kaffeløsninger n8n" (Client ID `78o6u0v9631s8p`,
  ejet af Claus) — status "Review in progress". Når LinkedIn godkender:
  1. Kør OAuth som Claus med scope `w_organization_social`
     (redirect http://localhost:8000/callback).
  2. Test med et DRAFT-opslag som `urn:li:organization:146603501`.
  3. Skift `TEDDY_LINKEDIN_AUTHOR_URN` til `urn:li:organization:146603501`
     og indsæt det nye token som `TEDDY_LINKEDIN_ACCESS_TOKEN` i plist'en,
     og genstart `ai.teddy.n8n`. Så poster workflowet som FIRMAET.

## Content process

1. n8n selects an asset from `billeder/` and prefers media not previously used
   on the relevant platform.
2. It selects a matching content theme from `content_system.json`.
3. It asks the existing GLM configuration to make the Danish copy natural while
   preserving the headline, factual claim, call to action and website.
4. It calls `automation/fb_post.py`, `ig_post.py` or `li_post.py` with a
   payload file; scripts read tokens from the launch-agent environment.
5. It writes history only after the platform confirms publication.

Images can be added to any of these folders:

- `billeder/integrationer`
- `billeder/automatisering`
- `billeder/b2b-portaler`
- `billeder/custom-bc-apps`
- `billeder/workflows`

## n8n environment variables (launch agent plist)

```text
TEDDY_FACEBOOK_PAGE_ID=1310521282144790
TEDDY_FACEBOOK_PAGE_ACCESS_TOKEN=<side-token, udløber aldrig>
TEDDY_META_SYSTEM_TOKEN=<systembruger-token, udløber aldrig>
TEDDY_IG_USER_ID=17841432910235196
TEDDY_IG_USERNAME=teddyapps82
TEDDY_LINKEDIN_ACCESS_TOKEN=<Teddy Bot-token, ~60 dage — fornys ved udløb>
TEDDY_LINKEDIN_AUTHOR_URN=urn:li:person:aneDsUK-iD
```

`N8N_RESTRICT_FILE_ACCESS_TO` skal indeholde `/Users/teddy/teddy-apps`, så
workflows kan læse `billeder/` og `content_system.json`.

Instagram-workflowet aktiveres først, når der er lavet én reel test-publicering
på @teddyapps82, der er bekræftet i UI'en.
