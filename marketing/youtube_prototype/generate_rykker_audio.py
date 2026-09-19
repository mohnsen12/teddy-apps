import os
import torch
import torchaudio as ta
from chatterbox.mtl_tts import ChatterboxMultilingualTTS

MODEL_DIR = '/Users/teddy/.cache/huggingface/hub/models--CoRal-project--roest-v3-chatterbox-500m/snapshots/7ce205cea6b3b36d9f60f18abb88ff21fa04ea0d'
REF_AUDIO = '/Users/teddy/teddy-apps/marketing/youtube_prototype/coral_mic_calm.wav'
OUT_DIR = '/Users/teddy/teddy-apps/marketing/youtube_prototype'

scenes = [
    ('rykker_scene1', "Bruger I unødig tid på at jagte ubetalte fakturaer og sende manuelle rykkere til debitorer? Ubetalte regninger skader likviditeten, og manuel gældsopfølgning stjæler fokus fra kerneforretningen."),
    ('rykker_scene2', "Teddy Apps automatiserer jeres rykkerprocedurer direkte i Business Central. Forfaldne poster overvåges i realtid, venlige betalingspåmindelser afsendes automatisk, og korrekte renter og gebyrer tilføjes uden manuel indgriben."),
    ('rykker_scene3', "Resultatet? 45 procent færre forfaldne fordringer, markant hurtigere pengestrøm og nul minutters spildt tid på manuel opfølgning."),
    ('rykker_scene4', "Få styr på jeres likviditet og sæt rykkerprocedurerne på autopilot. Kontakt Teddy Apps på teddyapps.dk.")
]

print("Loading CoRal Røst-v3 Chatterbox model on MPS GPU...")
model = ChatterboxMultilingualTTS.from_local(MODEL_DIR, device='mps')
print("Model loaded successfully!")

for name, text in scenes:
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

print("\nAll 4 Rykker voiceover scenes generated successfully!")
