#!/usr/bin/env bash
# Faixa de DEMONSTRAÇÃO para o player de áudio do site (não é uma produção da Haja).
# Pad + arpejo + baixo + batida leve, C–G–Am–F, 80 BPM, ~29 s. Feita no SoundCraft.
# Uso: bash som/gerar-demo.sh   (na raiz do projeto) -> public/audio/faixa-de-demonstracao/audio.wav
set -e
cd "$(dirname "$0")"
SC="/c/Program Files/ArtCraft/SoundCraft/soundcraft-cli.exe"
OUT=demo.cmds
SR=44100
LEN=$((SR*30))
PAD=2; ARP=4; BX=6; DR=8   # ids: cada track.new / midi.new_clip consome um id

: > $OUT
c() { echo "$1 $2" >> $OUT; }
# n clip pitch compasso(1..) tick dur vel   (960 ticks por tempo, 3840 por compasso)
n() { echo "midi.note_add {\"clip\":$1,\"pitch\":$2,\"start_ticks\":$(( ($3-1)*3840 + $4 )),\"length_ticks\":$5,\"velocity\":$6}" >> $OUT; }
ip() { c mix.instrument_param "{\"track\":\"$1\",\"param\":\"$2\",\"value\":$3}"; }
ins() { c mix.insert "{\"track\":\"$1\",\"slot\":$2,\"plugin\":\"$3\",\"params\":$4}"; }

c session.new "{\"name\":\"Haja demo\",\"sample_rate\":$SR,\"bit_depth\":16}"
c event.tempo '{"bpm":80}'
for t in Pad Arpejo Baixo Bateria; do
  inst=subtractive_synth; [ $t = Bateria ] && inst=drum_synth
  c track.new "{\"kind\":\"instrument\",\"format\":\"stereo\",\"name\":\"$t\",\"instrument\":\"$inst\"}"
  c midi.new_clip "{\"track\":\"$t\",\"start\":0,\"length\":$LEN}"
done

# acordes: C G Am F C G Am F C
ACORDES=("48 55 60 64" "43 55 59 62" "45 57 60 64" "41 53 57 60")
BAIXOS=(36 31 33 29)
for b in 1 2 3 4 5 6 7 8 9; do
  i=$(( (b-1) % 4 )); [ $b = 9 ] && i=0
  dur=3800; [ $b = 9 ] && dur=7600
  for p in ${ACORDES[$i]}; do n $PAD $((p+12)) $b 0 $dur 70; done
  n $BX ${BAIXOS[$i]} $b 0 $((dur-200)) 88
  # arpejo em colcheias a partir do compasso 3
  if [ $b -ge 3 ] && [ $b -le 8 ]; then
    set -- ${ACORDES[$i]}; notas=($(( $2+12 )) $(( $3+12 )) $(( $4+12 )) $(( $3+24 )))
    for k in 0 1 2 3 4 5 6 7; do n $ARP ${notas[$((k%4))]} $b $((k*480)) 300 $((58 + (k%4==0 ? 14 : 0))); done
  fi
  # batida leve a partir do compasso 5
  if [ $b -ge 5 ] && [ $b -le 8 ]; then
    n $DR 36 $b 0 400 84; n $DR 36 $b 1920 400 74
    n $DR 37 $b 960 300 52; n $DR 37 $b 2880 300 56
    for k in 0 1 2 3 4 5 6 7; do n $DR 42 $b $((k*480)) 150 $((k%2==0 ? 40 : 28)); done
  fi
done
n $DR 49 9 0 1600 60

ip Pad osc1_wave 1; ip Pad osc2_wave 1; ip Pad osc2_detune 14; ip Pad osc_mix 50
ip Pad cutoff 1400; ip Pad resonance 6; ip Pad amp_attack 900; ip Pad amp_sustain 90; ip Pad amp_release 1800; ip Pad level -14
ins Pad 0 room_reverb '{"mix":45,"decay":3.5,"size":90}'
ip Arpejo osc1_wave 2; ip Arpejo osc2_wave 0; ip Arpejo osc_mix 30; ip Arpejo cutoff 2600; ip Arpejo filter_env_amount 30
ip Arpejo amp_attack 2; ip Arpejo amp_decay 260; ip Arpejo amp_sustain 10; ip Arpejo amp_release 300; ip Arpejo level -18
ins Arpejo 0 mod_delay '{"time":375,"feedback":32,"mix":26}'
ins Arpejo 1 room_reverb '{"mix":30,"decay":2.4,"size":70}'
ip Baixo osc1_wave 0; ip Baixo osc2_wave 0; ip Baixo cutoff 500; ip Baixo amp_attack 20; ip Baixo amp_release 300; ip Baixo level -12
ip Bateria kick_decay 50; ip Bateria hat_decay 25
c mix.volume '{"tracks":["Bateria"],"db":-6}'

c track.new '{"kind":"master","format":"stereo","name":"Master"}'
c mix.insert '{"track":9,"slot":0,"plugin":"maximizer","params":{"threshold":-3,"ceiling":-1}}'
au() { c automation.set_point "{\"track\":9,\"param\":\"volume\",\"at\":$(( $1 * SR / 1000 )),\"value\":$2}"; }
au 0 -30; au 1500 0; au 26000 0; au 29000 -40; au 29500 -144

mkdir -p ../public/audio/faixa-de-demonstracao
"$SC" script $OUT --bounce ../public/audio/faixa-de-demonstracao/audio.wav --start 0 --end 29.5 --save demo.scraft > demo.log 2>&1 || { tail -5 demo.log; exit 1; }
grep -ciE 'error' demo.log || true
# FLAC 16 bits normalizado: ~3x menor que o WAV e toca em todos os navegadores atuais
D=../public/audio/faixa-de-demonstracao
"$SC" convert $D/audio.wav $D/audio.flac --bit-depth 16 --normalize
rm -f $D/audio.wav demo.cmds
