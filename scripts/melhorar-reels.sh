#!/bin/bash
# Amplia capas de reels (ex.: 360x640 -> 720x1280) e reforça a nitidez com o PhotoCraft.
# Uso, na raiz do projeto:
#   bash scripts/melhorar-reels.sh                 # trata img/ig/*.jpg e grava em img/tratadas/
#   bash scripts/melhorar-reels.sh capa.jpg saida.jpg
# Depois, suba a capa tratada no painel /keystatic (Reels → capa).
set -e
P="/c/Program Files/ArtCraft/PhotoCraft/photocraft-cli.exe"

tratar() {
  "$P" run "$1" \
    --cmd image.imageSize --params '{"width":720,"height":1280,"resample":"preserveDetails"}' \
    --cmd filter.sharpen.smartSharpen --params '{"amount":70,"radius":1.2,"reduceNoise":25}' \
    --out "$2" > /dev/null
  echo "ok  $2"
}

if [ $# -eq 2 ]; then
  tratar "$1" "$2"
else
  mkdir -p img/tratadas
  for f in img/ig/r*.jpg; do tratar "$f" "img/tratadas/$(basename "$f")"; done
fi
