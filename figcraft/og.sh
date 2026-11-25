#!/bin/bash
# Imagem de compartilhamento (1200x630) feito no FigCraft. Uso: bash og.sh  (roda dentro de figcraft/)
F="/c/Program Files/ArtCraft/FigCraft/figcraft-cli.exe"
OR="#FF5A1F"; BK="#0A0A0A"; WH="#FFFFFF"
CH="M0 0 L22 0 L52 30 L22 60 L0 60 L30 30 Z M40 0 L62 0 L92 30 L62 60 L40 60 L70 30 Z"
# ids: 2 frame, 3 brilho, 4 logo grande desfocado, 5..7 reels, 8 logo, 9 HAJA, 10 PRODUÇÕES, 11 frase, 12 tag
cat > og.jsonl <<EOF
{"command":"frame.create","params":{"name":"og","x":0,"y":0,"width":1200,"height":630,"props":{"fill":"$BK","clip":true}}}
{"command":"shape.ellipse","params":{"name":"brilho","x":560,"y":200,"width":760,"height":560,"parent":2,"props":{"fills":[{"type":"radialGradient","stops":["#FF5A1F66","#FF5A1F00"]}]}}}
{"command":"vector.create","params":{"name":"logo desfocado","path":"$CH","closed":true,"x":-80,"y":220,"width":420,"parent":2,"props":{"fill":"$OR","opacity":0.12,"effects":[{"type":"layerBlur","radius":40}]}}}
{"command":"image.place","params":{"name":"reel r09","path":"../src/assets/reels/session-acustica-cadeira/capa.jpg","x":690,"y":150,"width":180,"height":320,"parent":2,"mode":"fill"}}
{"command":"image.place","params":{"name":"reel r08","path":"../src/assets/reels/louvor-ao-vivo-no-estudio/capa.jpg","x":850,"y":100,"width":236,"height":420,"parent":2,"mode":"fill"}}
{"command":"image.place","params":{"name":"reel r11","path":"../src/assets/reels/haja-sessions-fundo-azul/capa.jpg","x":1066,"y":150,"width":180,"height":320,"parent":2,"mode":"fill"}}
{"command":"vector.create","params":{"name":"logo >>","path":"$CH","closed":true,"x":80,"y":200,"width":110,"parent":2,"props":{"fill":"$OR"}}}
{"command":"text.create","params":{"text":"HAJA","x":210,"y":178,"parent":2,"props":{"fontFamily":"Montserrat","fontStyle":"Black","fontSize":96,"fill":"$WH","letterSpacing":"-2%"}}}
{"command":"text.create","params":{"text":"PRODUÇÕES · BRASIL","x":216,"y":290,"parent":2,"props":{"fontFamily":"Inter","fontStyle":"SemiBold","fontSize":18,"fill":"$OR","letterSpacing":"14%"}}}
{"command":"text.create","params":{"text":"Onde o HAJA se torna realidade.","x":82,"y":370,"parent":2,"props":{"fontFamily":"Montserrat","fontStyle":"ExtraBold","fontSize":30,"fill":"$WH"}}}
{"command":"text.create","params":{"text":"Produções musicais e audiovisual","x":82,"y":420,"parent":2,"props":{"fontFamily":"Inter","fontStyle":"Regular","fontSize":17,"fill":"#A1A1A6"}}}
EOF
"$F" run og.jsonl --out og.figcraft > /dev/null || exit 1
# cantos arredondados dos reels (ids 5,6,7)
cat > og-cantos.jsonl <<EOF
{"command":"node.set","params":{"id":5,"cornerRadius":20}}
{"command":"node.set","params":{"id":6,"cornerRadius":24}}
{"command":"node.set","params":{"id":7,"cornerRadius":20}}
EOF
"$F" run og-cantos.jsonl --in og.figcraft --out og.figcraft > /dev/null || exit 1
"$F" export og.figcraft --node og --out ../public/og.png
rm -f og.jsonl og-cantos.jsonl
