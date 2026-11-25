#!/bin/bash
# Gera haja-site.figcraft: design system + landing desktop (1440) + mobile (390)
# Uso: bash gerar.sh  (ids sao sequenciais a partir de 2)
OUT=script.jsonl
: > $OUT
N=2
LAST=0
OR="#FF5A1F"; BK="#0A0A0A"; WH="#FFFFFF"; GR="#F5F5F7"; MU="#86868B"; DK="#1D1D1F"

emit(){ echo "$1" >> $OUT; LAST=$N; N=$((N+1)); }
# frame name x y w h fill parent radius clip
frame(){ local p=""; [ -n "$7" ] && p=",\"parent\":$7"; emit "{\"command\":\"frame.create\",\"params\":{\"name\":\"$1\",\"x\":$2,\"y\":$3,\"width\":$4,\"height\":$5$p,\"props\":{\"fill\":\"$6\",\"cornerRadius\":${8:-0},\"clip\":${9:-true}}}}"; }
# rect name x y w h fill parent radius [opacity]
rect(){ emit "{\"command\":\"shape.rectangle\",\"params\":{\"name\":\"$1\",\"x\":$2,\"y\":$3,\"width\":$4,\"height\":$5,\"parent\":$7,\"props\":{\"fill\":\"$6\",\"cornerRadius\":${8:-0},\"opacity\":${9:-1}}}}"; }
# text "txt" x y parent size style color [width] [align] [family]
text(){ local w=""; [ -n "$8" ] && [ "$8" != "-" ] && w=",\"width\":$8"; emit "{\"command\":\"text.create\",\"params\":{\"text\":\"$1\",\"x\":$2,\"y\":$3,\"parent\":$4$w,\"props\":{\"fontFamily\":\"${10:-Montserrat}\",\"fontStyle\":\"$6\",\"fontSize\":$5,\"fill\":\"$7\",\"textAlign\":\"${9:-left}\",\"lineHeight\":\"115%\",\"letterSpacing\":\"-2%\"}}}"; }
img(){ emit "{\"command\":\"image.place\",\"params\":{\"name\":\"$1\",\"path\":\"../img/ig/$1.jpg\",\"x\":$2,\"y\":$3,\"width\":$4,\"height\":$5,\"parent\":$6,\"mode\":\"fill\"}}"; }
chev(){ # logo >> vetor: x y escala parent cor
  local s=$3; emit "{\"command\":\"vector.create\",\"params\":{\"name\":\"logo >>\",\"path\":\"M0 0 L22 0 L52 30 L22 60 L0 60 L30 30 Z M40 0 L62 0 L92 30 L62 60 L40 60 L70 30 Z\",\"closed\":true,\"x\":$1,\"y\":$2,\"width\":$((92*s/10)),\"parent\":$4,\"props\":{\"fill\":\"${5:-$OR}\"}}}"; }
# celular estilo reel: x y w parent imagem legenda
phone(){
  local x=$1 y=$2 w=$3 par=$4 im=$5 cap=$6; local h=$((w*16/9))
  frame "reel $im" $x $y $w $h "$BK" $par 28 true; local f=$LAST
  img $im 0 0 $w $h $f
  rect "sombra" 0 $((h-140)) $w 140 "#000000" $f 0 0.45
  text "@hajaproducoesbrasil" 16 $((h-70)) $f 13 "SemiBold" "$WH" - left Inter
  text "$cap" 16 $((h-48)) $f 12 "Regular" "$WH" $((w-60)) left Inter
  text "♥" $((w-34)) $((h-200)) $f 20 "Regular" "$WH" - left Inter
  text "▶ Reels" 16 16 $f 12 "SemiBold" "$WH" - left Inter
}

# ===================== PAGINA 1: Desktop =====================
W=1440
frame "Desktop · Haja" 0 0 $W 6400 "$WH" "" 0 true; D=$LAST
# --- NAV
frame "nav" 0 0 $W 56 "#0A0A0ACC" $D 0 true; NV=$LAST
chev 40 18 2 $NV
text "HAJA" 72 17 $NV 18 "Black" "$WH"
x=520; for it in "Sobre" "Produções" "Haja Day" "Serviços" "Contato"; do text "$it" $x 19 $NV 13 "Medium" "#E8E8ED" - left Inter; x=$((x+110)); done
frame "cta nav" 1250 12 150 32 "$OR" $NV 16 true; c=$LAST; text "Fale conosco" 26 8 $c 13 "SemiBold" "$WH" - left Inter
# --- HERO (preto)
frame "hero" 0 56 $W 900 "$BK" $D 0 true; H=$LAST
text "PRODUÇÕES MUSICAIS · AUDIOVISUAL" 0 120 $H 14 "SemiBold" "$OR" $W center Inter
text "Onde o HAJA" 0 160 $H 120 "Black" "$WH" $W center
text "se torna realidade." 0 300 $H 120 "Black" "$WH" $W center
text "Criatividade a serviço do Reino — do primeiro take ao último frame." 0 460 $H 22 "Regular" "#A1A1A6" $W center Inter
frame "btn" 560 520 160 48 "$OR" $H 24 true; c=$LAST; text "Ver produções" 28 14 $c 15 "SemiBold" "$WH" - left Inter
frame "btn2" 736 520 150 48 "$BK" $H 24 true; c=$LAST; text "Assistir ›" 36 14 $c 15 "SemiBold" "$OR" - left Inter
x=200; for r in r03 r08 r02 r09 r11; do phone $x 620 200 $H $r "Haja Productions"; x=$((x+212)); done
# --- STATEMENT (branco)
frame "manifesto" 0 956 $W 640 "$WH" $D 0 true; M=$LAST
text "Cada som. Cada take." 160 160 $M 72 "Black" "$DK" 1120
text "Cada história contada" 160 250 $M 72 "Black" "#C7C7CC" 1120
text "com excelência e propósito." 160 340 $M 72 "Black" "$OR" 1120
text "A Haja Produções nasceu para dar voz a artistas, ministérios e marcas que querem transmitir uma mensagem com qualidade de estúdio." 160 470 $M 22 "Regular" "$MU" 760 left Inter
# --- SCROLLYTELLING: texto + reel lateral (cinza claro)
frame "produções · texto + reel lateral" 0 1596 $W 1500 "$GR" $D 0 true; S=$LAST
y=140
for blk in "01|Gravação ao vivo|Sessões gravadas com várias câmeras, áudio multipista e luz desenhada para o louvor." \
           "02|Sessions acústicas|Ambientes intimistas, cores fortes e foco total na voz. Cada session vira um reel pronto para as redes." \
           "03|Bastidores|Mostramos o processo: câmera, monitor, banda e equipe trabalhando juntos." ; do
  IFS='|' read n t d <<< "$blk"
  text "$n" 140 $y $S 15 "Bold" "$OR" - left Inter
  text "$t" 140 $((y+30)) $S 56 "Black" "$DK" 640
  text "$d" 140 $((y+110)) $S 21 "Regular" "$MU" 560 left Inter
  y=$((y+420))
done
phone 900 160 380 $S r08 "Louvor ao vivo no estúdio Haja"
text "↑ o reel fica fixo na lateral e troca conforme o texto avança" 880 860 $S 13 "Medium" "$MU" 420 left Inter
# --- GALERIA de reels (preto)
frame "galeria reels" 0 3096 $W 1000 "$BK" $D 0 true; G=$LAST
text "Produções recentes." 80 100 $G 64 "Black" "$WH"
text "Arraste para ver mais  →" 80 190 $G 18 "Regular" "#A1A1A6" - left Inter
x=80; for r in r02 r04 r05 r06 r07 r10; do phone $x 260 260 $G $r "Haja Produções"; x=$((x+280)); done
# --- HAJA DAY (laranja)
frame "haja day" 0 4096 $W 820 "$OR" $D 0 true; HD=$LAST
text "HAJA DAY" 120 140 $HD 18 "Bold" "$BK" - left Inter
text "Um dia inteiro" 120 180 $HD 88 "Black" "$WH" 700
text "de criação." 120 280 $HD 88 "Black" "$BK" 700
text "Já estamos na terceira edição. Artistas, câmeras, luz e som no mesmo lugar para produzir conteúdo de verdade." 120 420 $HD 22 "Regular" "$WH" 540 left Inter
frame "btn day" 120 540 200 52 "$BK" $HD 26 true; c=$LAST; text "Quero participar" 30 16 $c 15 "SemiBold" "$WH" - left Inter
phone 860 90 360 $HD r03 "3ª edição do Haja Day"
# --- SERVIÇOS (branco)
frame "serviços" 0 4916 $W 920 "$WH" $D 0 true; SV=$LAST
text "O que fazemos." 0 110 $SV 64 "Black" "$DK" $W center
i=0
for s in "Produção musical|Gravação, mixagem e direção vocal." "Videoclipes|Roteiro, captação e edição." "Live sessions|Multicâmera com áudio de estúdio." "Cobertura de eventos|Do culto ao festival." "Entrevistas e podcasts|Histórias contadas com luz de cinema." "Conteúdo para redes|Reels pensados para o feed vertical."; do
  IFS='|' read t d <<< "$s"; cx=$((120+(i%3)*408)); cy=$((260+(i/3)*290))
  frame "card $t" $cx $cy 384 260 "$GR" $SV 28 true; c=$LAST
  chev 32 36 3 $c
  text "$t" 32 120 $c 28 "Black" "$DK" 320
  text "$d" 32 200 $c 17 "Regular" "$MU" 320 left Inter
  i=$((i+1))
done
# --- CONTATO + footer (preto)
frame "contato" 0 5836 $W 564 "$BK" $D 0 true; CT=$LAST
chev 660 90 12 $CT
text "Vamos fazer HAJA." 0 230 $CT 72 "Black" "$WH" $W center
text "+55 27 99766-1514  ·  @hajaproducoesbrasil" 0 330 $CT 20 "Regular" "#A1A1A6" $W center Inter
frame "btn whats" 600 390 240 54 "$OR" $CT 27 true; c=$LAST; text "Chamar no WhatsApp" 30 17 $c 16 "SemiBold" "$WH" - left Inter
text "© 2026 Haja Produções Brasil · por @hajaproducoesglobal" 0 520 $CT 12 "Regular" "#6E6E73" $W center Inter

# ===================== Mobile (390) =====================
MX=1540
frame "Mobile · Haja" $MX 0 390 2400 "$BK" "" 0 true; MB=$LAST
chev 20 18 2 $MB; text "HAJA" 52 17 $MB 18 "Black" "$WH"; text "☰" 350 14 $MB 22 "Regular" "$WH" - left Inter
text "Onde o HAJA se torna realidade." 20 110 $MB 48 "Black" "$WH" 350
text "Criatividade a serviço do Reino." 20 360 $MB 18 "Regular" "#A1A1A6" 350 left Inter
phone 45 420 300 $MB r09 "Session acústica"
frame "m texto" 0 1000 390 700 "$WH" $MB 0 true; MT=$LAST
text "Cada som. Cada take." 20 60 $MT 40 "Black" "$DK" 350
text "com excelência e propósito." 20 160 $MT 40 "Black" "$OR" 350
phone 95 300 200 $MT r11 "Haja Sessions"
frame "m day" 0 1700 390 700 "$OR" $MB 0 true; MD=$LAST
text "HAJA DAY" 20 60 $MD 14 "Bold" "$BK" - left Inter
text "Um dia inteiro de criação." 20 90 $MD 44 "Black" "$WH" 350
phone 95 300 200 $MD r03 "3ª edição"

# ===================== Design system =====================
frame "Design system" 2030 0 900 700 "$WH" "" 0 true; DS=$LAST
text "Haja · Design system" 40 40 $DS 32 "Black" "$DK"
x=40; for c in "$BK|Preto 0A0A0A" "$OR|Laranja FF5A1F" "$WH|Branco FFFFFF" "$GR|Cinza F5F5F7" "$DK|Grafite 1D1D1F"; do
  IFS='|' read cc nn <<< "$c"; rect "$nn" $x 110 150 150 "$cc" $DS 24; text "$nn" $x 272 $DS 13 "Medium" "$DK" - left Inter; x=$((x+165)); done
text "Montserrat Black — títulos" 40 340 $DS 40 "Black" "$DK"
text "Inter Regular — textos de apoio e interface" 40 400 $DS 20 "Regular" "$MU" - left Inter
frame "logo" 40 460 380 180 "$BK" $DS 24 true; LG=$LAST
chev 40 60 6 $LG; text "HAJA" 120 52 $LG 56 "Black" "$WH"; text "PRODUÇÕES" 122 112 $LG 13 "SemiBold" "$OR" - left Inter
frame "logo branco" 440 460 380 180 "$WH" $DS 24 true; LW=$LAST
rect "borda" 0 0 380 180 "$GR" $LW 24
chev 40 60 6 $LW; text "HAJA" 120 52 $LW 56 "Black" "$BK"; text "PRODUÇÕES" 122 112 $LW 13 "SemiBold" "$OR" - left Inter

echo "ultimo id: $LAST" >&2
