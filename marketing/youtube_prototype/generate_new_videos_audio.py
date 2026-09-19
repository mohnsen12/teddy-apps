import os
import torch
import torchaudio as ta
from chatterbox.mtl_tts import ChatterboxMultilingualTTS

MODEL_DIR = '/Users/teddy/.cache/huggingface/hub/models--CoRal-project--roest-v3-chatterbox-500m/snapshots/7ce205cea6b3b36d9f60f18abb88ff21fa04ea0d'
REF_AUDIO = '/Users/teddy/teddy-apps/marketing/youtube_prototype/coral_mic_calm.wav'
OUT_DIR = '/Users/teddy/teddy-apps/marketing/youtube_prototype'

tasks = [
    # Video 1: Bogføring
    ('bogfoering_scene1', "Bruger jeres økonomiafdeling stadig utallige timer på at taste bankposter og udligne leverandørfakturaer manuelt? Manuelle bogføringsrutiner skaber forsinkelser, tastefejl og frustration ved månedsslutning."),
    ('bogfoering_scene2', "Teddy Apps automatiserer jeres bogføring direkte i Business Central. Bankudtog indlæses automatisk, intelligente regler udligner åbne poster, og gentagne betalinger bogføres med ét klik uden manuelle mellemled."),
    ('bogfoering_scene3', "Resultatet? 85 procent tidsbesparelse på rutinebogføring, fuldt opdateret bankkonto hver eneste dag og fuldstændig styr på revisionssporet."),
    ('bogfoering_scene4', "Få automatiseret jeres bogføring og spar værdifulde timer i dag. Kontakt Teddy Apps på teddyapps.dk."),

    # Video 2: B2B Forhandlerportal
    ('b2b_scene1', "Modtager I stadig B2B-ordrer på mail og telefon, mens jeres forhandlere efterspørger lagerstatus og priser? Manuel ordreindtastning binder kundeservice og koster tabt salg uden for normal åbningstid."),
    ('b2b_scene2', "Med en skræddersyet B2B-portal fra Teddy Apps handler forhandlerne direkte ind i jeres Business Central. De ser deres egne aftalepriser, live lagerbeholdning og kan uploade massebestillinger døgnet rundt."),
    ('b2b_scene3', "Resultatet? Automatisk ordremodtagelse 24 syv, markant færre rutineopkald og en professionel digital oplevelse for jeres vigtigste kunder."),
    ('b2b_scene4', "Giv jeres B2B-salg et digitalt løft. Lad Teddy Apps bygge jeres forhandlerportal på teddyapps.dk.")
]

print("Loading CoRal Røst-v3 Chatterbox model on MPS GPU...")
model = ChatterboxMultilingualTTS.from_local(MODEL_DIR, device='mps')
print("Model loaded successfully!")

for name, text in tasks:
    out_wav = os.path.join(OUT_DIR, f'{name}.wav')
    print(f"\n>>> Generating: {name} <<<")
    print(f"Text: {text}")
    wav = model.generate(
        text,
        language_id='da',
        audio_prompt_path=REF_AUDIO,
        temperature=0.6,
        exaggeration=0.35,
        repetition_penalty=2.0
    )
    ta.save(out_wav, wav, model.sr)
    print(f"Saved: {out_wav}")

print("\nAll 8 voiceover files generated successfully!")
