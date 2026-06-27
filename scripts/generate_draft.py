#!/usr/bin/env python3
"""
Teddy Apps — Content Generator Script
Runs via cron, generates LinkedIn post drafts, saves to content/drafts/
This is a data-collection script: it outputs a summary that the cron agent can use.
"""
import json, os, sys
from datetime import datetime, timedelta
from pathlib import Path

REPO = Path("/Users/teddy/teddy-apps")
CONFIG_PATH = REPO / "content" / "config.json"
DRAFTS_DIR = REPO / "content" / "drafts"
POSTS_DIR = REPO / "content" / "posts"

# Load config
with open(CONFIG_PATH) as f:
    config = json.load(f)

# Determine which service to rotate to
services = config["services"]
used_topics = config.get("topics_used", [])
last_service_id = used_topics[-1] if used_topics else None

# Pick next service (rotation)
service_order = [s["id"] for s in services]
if last_service_id and last_service_id in service_order:
    last_idx = service_order.index(last_service_id)
    next_idx = (last_idx + 1) % len(services)
else:
    next_idx = 0

next_service = services[next_idx]

# Topic ideas per service — these are seeds for the agent to expand
TOPIC_SEEDS = {
    "integrationer": [
        "BC ↔ Shopify/woocommerce synkronisering",
        "BC ↔ CRM (Power BI, HubSpot) integration",
        "BC ↔ bank/faktura automatisering",
        "Automatisk ordrehåndtering på tværs af systemer",
        "Realtids lageropdatering mellem BC og webshop",
        "BC og APS/produktionssystemer integration",
        "Email/EDI fakturabehandling direkte i BC",
        "BC ↔ Excel automatisering — stop manuel eksport",
    ],
    "bc-apps": [
        "Custom workflows og godkendelsesprocesser i BC",
        "Skræddersyede rapporter og dashboards i BC",
        "Automatisering af manuelle BC-processer",
        "BC extensions til specifikke brancher",
        "PDA/scanner integration til lageroptælling",
        "Automatisk rabatstyring og kundepriser i BC",
        "Custom item tracking og serial number management",
        "BC event subscribers — skjulte automatiseringer",
    ],
    "php-web": [
        "B2B portal integreret med BC",
        "Kunde selvbetjening — lad kunder se ordrestatus fra BC",
        "PHP API endpoints for BC data",
        "Custom webformularer der opretter records i BC",
        "Webshop optimeret til BC-datastruktur",
        "Landingssider med dynamiske BC-priser",
        "Mobilvenlig ordreindtastning via web",
        "PDF fakturagenerering fra BC-data via PHP",
    ],
}

# Pick a topic that hasn't been used recently
seeds = TOPIC_SEEDS.get(next_service["id"], [])
unused_seeds = [s for s in seeds if s not in used_topics]
if not unused_seeds:
    # Reset if all used
    unused_seeds = seeds
topic = unused_seeds[0] if unused_seeds else f"Generelt om {next_service['name']}"

# Calculate which day this is for
today = datetime.now()
days_map = {0: "Mandag", 1: "Torsdag", 2: "Lørdag"}
day_name = today.strftime("%A")

# Create draft metadata
draft = {
    "id": f"draft-{datetime.now().strftime('%Y%m%d-%H%M%S')}",
    "service": next_service["id"],
    "service_name": next_service["name"],
    "topic": topic,
    "created_at": datetime.now().isoformat(),
    "status": "draft",
    "language": "da",
    "format": "70% edukativ, 30% soft CTA",
    "instructions": f"""
Skriv et LinkedIn-opslag på DANSK om emnet: '{topic}'.

Krav:
- Målgruppe: Danske SMB'er der bruger Business Central
- Tone: Profesjonelt men tilgængeligt, ikke for teknisk
- 70% værdi/edukation, 30% soft CTA i slutningen
- Brug emojis mæssigt (1-2 stykker)
- Inkluder 2-3 konkrete punkter med værdi
- Afslut med soft CTA: "Send en besked" eller "Se mere på teddyapps.dk"
- Hashtags: 3-5 relevante ( Danish + BC relaterede)
- Længde: 150-250 ord
- Brand mention: "Vi får Business Central til at arbejde for din virksomhed!"
"""
}

# Save draft
DRAFTS_DIR.mkdir(parents=True, exist_ok=True)
draft_path = DRAFTS_DIR / f"{draft['id']}.json"
with open(draft_path, "w") as f:
    json.dump(draft, f, indent=2, ensure_ascii=False)

# Update config
config["topics_used"].append(next_service["id"])
if len(config["topics_used"]) > 20:
    config["topics_used"] = config["topics_used"][-10:]
with open(CONFIG_PATH, "w") as f:
    json.dump(config, f, indent=2, ensure_ascii=False)

# Output for the cron agent
print(f"📋 CONTENT DRAFT GENERATED")
print(f"=" * 50)
print(f"Service: {next_service['name']} ({next_service['icon']})")
print(f"Topic: {topic}")
print(f"Draft file: {draft_path}")
print(f"Language: Danish")
print(f"")
print(f"Next step: Generate the actual LinkedIn post text from this draft,")
print(f"save it as a .md file in content/posts/, and notify Claus via Telegram")
print(f"for approval before posting.")
