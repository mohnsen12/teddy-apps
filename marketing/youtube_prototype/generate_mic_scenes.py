import os
import torch
import torchaudio as ta
from chatterbox.mtl_tts import ChatterboxMultilingualTTS

MODEL_DIR = '/Users/teddy/.cache/huggingface/hub/models--CoRal-project--roest-v3-chatterbox-500m/snapshots/7ce205cea6b3b36d9f60f18abb88ff21fa04ea0d'
REF_AUDIO = '/Users/teddy/teddy-apps/marketing/youtube_prototype/coral_mic_calm.wav'
OUT_DIR = '/Users/teddy/teddy-apps/marketing/youtube_prototype'

scenes = [
    (1, "Taster I stadig trackingnumre og opretter fragtbreve manuelt i Business Central? Manuel ordrebehandling koster dyrebare timer hver uge og fører til fejl og forsinkelser."),
    (2, "Teddy Apps forbinder Business Central direkte med GLS ShipIT via et lynhurtigt REST API. Fragtbreve dannes med ét klik, tracking synkroniseres i realtid, og pakken er klar med det samme."),
    (3, "Resultatet? Nul fejlindtastninger, timer sparet hver eneste dag, og lynhurtig ekspedition til jeres kunder."),
    (4, "Sæt jeres Business Central på autopilot. Få bygget jeres næste integration hos Teddy Apps på teddyapps.dk.")
]

print("Initializing Chatterbox model with MPS...")
model = ChatterboxMultilingualTTS.from_local(MODEL_DIR, device='mps')
print("Model loaded!")

for s_num, text in scenes:
    out_wav = os.path.join(OUT_DIR, f'mic_scene{s_num}.wav')
    print(f"\n--- Generating Scene {s_num} ---")
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

print("\nAll scenes successfully generated!")
