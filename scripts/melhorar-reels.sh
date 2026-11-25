#!/bin/bash
# Amplia as capas dos reels (360x640 -> 720x1280) e reforça a nitidez com o PhotoCraft.
# Uso, na raiz do projeto:  bash scripts/melhorar-reels.sh
set -e
P="/c/Program Files/ArtCraft/PhotoCraft/photocraft-cli.exe"
mkdir -p site/img/hd
for f in img/ig/r*.jpg; do
  n=$(basename "$f")
  "$P" run "$f" \
    --cmd image.imageSize --params '{"width":720,"height":1280,"resample":"preserveDetails"}' \
    --cmd filter.sharpen.smartSharpen --params '{"amount":70,"radius":1.2,"reduceNoise":25}' \
    --out "site/img/hd/$n" > /dev/null
  echo "ok  $n"
done
