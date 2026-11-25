#!/bin/bash
# Banner do README (1280x420) feito no FigCraft. Uso: bash banner.sh  (roda dentro de figcraft/)
F="/c/Program Files/ArtCraft/FigCraft/figcraft-cli.exe"
OR="#FF5A1F"; BK="#0A0A0A"; WH="#FFFFFF"
CH="M0 0 L22 0 L52 30 L22 60 L0 60 L30 30 Z M40 0 L62 0 L92 30 L62 60 L40 60 L70 30 Z"
# ids: 2 frame, 3 brilho, 4 logo grande desfocado, 5..7 reels, 8 logo, 9 HAJA, 10 PRODUÇÕES, 11 frase, 12 tag
cat > banner.jsonl <<EOF
{"command":"frame.create","params":{"name":"banner","x":0,"y":0,"width":1280,"height":420,"props":{"fill":"$BK","clip":true}}}
{"command":"shape.ellipse","params":{"name":"brilho","x":620,"y":120,"width":760,"height":520,"parent":2,"props":{"fills":[{"type":"radialGradient","stops":["#FF5A1F66","#FF5A1F00"]}]}}}
{"command":"vector.create","params":{"name":"logo desfocado","path":"$CH","closed":true,"x":-80,"y":220,"width":420,"parent":2,"props":{"fill":"$OR","opacity":0.12,"effects":[{"type":"layerBlur","radius":40}]}}}
{"command":"image.place","params":{"name":"reel r09","path":"../site/img/hd/r09.jpg","x":780,"y":70,"width":160,"height":284,"parent":2,"mode":"fill"}}
{"command":"image.place","params":{"name":"reel r08","path":"../site/img/hd/r08.jpg","x":930,"y":40,"width":190,"height":338,"parent":2,"mode":"fill"}}
{"command":"image.place","params":{"name":"reel r11","path":"../site/img/hd/r11.jpg","x":1110,"y":70,"width":160,"height":284,"parent":2,"mode":"fill"}}
{"command":"vector.create","params":{"name":"logo >>","path":"$CH","closed":true,"x":80,"y":118,"width":110,"parent":2,"props":{"fill":"$OR"}}}
{"command":"text.create","params":{"text":"HAJA","x":210,"y":96,"parent":2,"props":{"fontFamily":"Montserrat","fontStyle":"Black","fontSize":96,"fill":"$WH","letterSpacing":"-2%"}}}
{"command":"text.create","params":{"text":"PRODUÇÕES · BRASIL","x":216,"y":208,"parent":2,"props":{"fontFamily":"Inter","fontStyle":"SemiBold","fontSize":18,"fill":"$OR","letterSpacing":"14%"}}}
{"command":"text.create","params":{"text":"Onde o HAJA se torna realidade.","x":82,"y":276,"parent":2,"props":{"fontFamily":"Montserrat","fontStyle":"ExtraBold","fontSize":30,"fill":"$WH"}}}
{"command":"text.create","params":{"text":"Protótipo de site · scroll no estilo Apple · reels em formato Instagram","x":82,"y":324,"parent":2,"props":{"fontFamily":"Inter","fontStyle":"Regular","fontSize":17,"fill":"#A1A1A6"}}}
EOF
"$F" run banner.jsonl --out banner.figcraft > /dev/null || exit 1
# cantos arredondados dos reels (ids 5,6,7)
cat > cantos.jsonl <<EOF
{"command":"node.set","params":{"id":5,"cornerRadius":20}}
{"command":"node.set","params":{"id":6,"cornerRadius":24}}
{"command":"node.set","params":{"id":7,"cornerRadius":20}}
EOF
"$F" run cantos.jsonl --in banner.figcraft --out banner.figcraft > /dev/null || exit 1
"$F" export banner.figcraft --node banner --scale 2 --out ../docs/banner.png
rm -f banner.jsonl cantos.jsonl
