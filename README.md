<a id="topo"></a>

<p align="center">
  <img src="docs/banner.png" alt="Haja Produções: onde o HAJA se torna realidade" width="100%">
</p>

<p align="center">
  <a href="https://rafascoelho22.github.io/haja-site/"><strong>Ver o site no ar »</strong></a>
  &nbsp;·&nbsp;
  <a href="#editar-o-conteúdo-sem-código">Editar o conteúdo</a>
  &nbsp;·&nbsp;
  <a href="#capturas-de-tela">Capturas de tela</a>
  &nbsp;·&nbsp;
  <a href="https://www.instagram.com/hajaproducoesbrasil/">@hajaproducoesbrasil</a>
</p>

<p align="center">
  <a href="https://github.com/Rafascoelho22/haja-site/actions/workflows/pages.yml"><img alt="Deploy" src="https://github.com/Rafascoelho22/haja-site/actions/workflows/pages.yml/badge.svg"></a>
  <img alt="Astro 7" src="https://img.shields.io/badge/Astro-7-0A0A0A?style=flat-square&logo=astro&logoColor=FF5A1F">
  <img alt="Keystatic" src="https://img.shields.io/badge/CMS-Keystatic-0A0A0A?style=flat-square">
  <img alt="Design no FigCraft" src="https://img.shields.io/badge/design-FigCraft-FF5A1F?style=flat-square">
  <img alt="Imagens no PhotoCraft" src="https://img.shields.io/badge/imagens-PhotoCraft-FF5A1F?style=flat-square">
  <img alt="Áudio no SoundCraft" src="https://img.shields.io/badge/áudio-SoundCraft-FF5A1F?style=flat-square">
</p>

---

<details>
  <summary><strong>Sumário</strong></summary>

1. [Sobre o projeto](#sobre-o-projeto)
2. [Páginas](#páginas)
3. [Capturas de tela](#capturas-de-tela)
4. [Editar o conteúdo sem código](#editar-o-conteúdo-sem-código)
5. [Configurações: agenda, Haja Day e métricas](#configurações-agenda-haja-day-e-métricas)
6. [Domínio próprio](#domínio-próprio)
7. [Como foi feito](#como-foi-feito)
8. [Estrutura de pastas](#estrutura-de-pastas)
9. [Rodar localmente](#rodar-localmente)
10. [Próximos passos](#próximos-passos)
11. [Créditos e direitos](#créditos-e-direitos)

</details>

## Sobre o projeto

Site da **Haja Produções Brasil**, produtora de música e audiovisual que trabalha com louvor ao vivo, sessions acústicas, entrevistas e conteúdo para redes.

A navegação segue a lógica das páginas de produto da Apple. A página vai se revelando conforme a pessoa rola, e os vídeos aparecem como o público já conhece: **reels verticais no formato do Instagram**, ao lado do texto.

- **Astro 7**: o site é gerado como páginas estáticas, rápido e hospedado de graça no GitHub Pages.
- **Keystatic**: um painel para a equipe da Haja adicionar reels, faixas e edições do Haja Day sem mexer em código.
- **Imagens otimizadas**: cada capa vira WebP em quatro tamanhos, e o navegador baixa só o que precisa (10 a 100 KB por capa).
- **Transições suaves** entre páginas, com a View Transitions API nativa do navegador.
- **Pensado para o celular**: conteúdo centralizado, menu próprio e botão de WhatsApp sempre à mão.
- **SEO**: título e descrição por página, imagem de compartilhamento, sitemap e dados estruturados (schema.org).
- **Acessível**: respeita a opção de reduzir animações, tem o atalho "Pular para o conteúdo", foco visível e rótulos em todos os reels e botões.

<p align="right"><a href="#topo">voltar ao topo ↑</a></p>

## Páginas

| Página | O que tem |
|---|---|
| **[Início](https://rafascoelho22.github.io/haja-site/)** | Abertura com reels em leque, manifesto que acende palavra por palavra, capítulos com o reel fixo na lateral, galeria horizontal, Haja Day, serviços e contato. |
| **[Portfólio](https://rafascoelho22.github.io/haja-site/portfolio/)** | Todos os reels, com filtro por tipo (louvor ao vivo, sessions, bastidores…). A grade se reorganiza com animação, e o filtro fica no link (`/portfolio/#sessions`). |
| **[Som](https://rafascoelho22.github.io/haja-site/som/)** | Player de áudio com forma de onda ([wavesurfer.js](https://wavesurfer.xyz)). Toca uma faixa por vez, e a forma de onda só carrega quando aparece na tela. |
| **[Haja Day](https://rafascoelho22.github.io/haja-site/haja-day/)** | Próxima edição com contagem regressiva e link de inscrição (ou "Quero ser avisado", enquanto não há data) e a lista das edições com os reels de cada uma. |
| **[Agendar](https://rafascoelho22.github.io/haja-site/agendar/)** | Agenda do [Cal.com](https://cal.com) dentro do site, quando configurada. Sem ela, um formulário curto monta a mensagem e abre o WhatsApp. |

<p align="right"><a href="#topo">voltar ao topo ↑</a></p>

## Capturas de tela

| Desktop | Celular |
|:--|:--:|
| <img src="docs/desktop-inicio.png" alt="Página inicial no desktop" width="560"> | <img src="docs/mobile-inicio.png" alt="Página inicial no celular" width="200"> |
| <img src="docs/desktop-portfolio.png" alt="Portfólio com filtros" width="560"> | <img src="docs/mobile-portfolio.png" alt="Portfólio no celular" width="200"> |
| <img src="docs/desktop-som.png" alt="Página de som com o player" width="560"> | <img src="docs/mobile-som.png" alt="Player de áudio no celular" width="200"> |
| <img src="docs/desktop-haja-day.png" alt="Página do Haja Day" width="560"> | <img src="docs/mobile-haja-day.png" alt="Haja Day no celular" width="200"> |

<details>
  <summary>Página de agendamento</summary>

<img src="docs/desktop-agendar.png" alt="Formulário de agendamento pelo WhatsApp" width="100%">

</details>

<p align="right"><a href="#topo">voltar ao topo ↑</a></p>

## Editar o conteúdo sem código

O conteúdo fica em arquivos dentro do próprio repositório e é editado pelo painel do **Keystatic**:

```bash
npm install        # só na primeira vez
npm run dev
# abra http://127.0.0.1:4321/keystatic
```

| No painel | O que muda no site |
|---|---|
| **Reels** | Título, legenda, categoria, capa vertical (9:16), código do reel no Instagram, data e se aparece na página inicial. |
| **Faixas de áudio** | Título, artista, descrição e arquivo (mp3, wav ou flac). Desmarque "Faixa de demonstração" ao subir uma produção real. |
| **Edições do Haja Day** | Número, data, resumo e os reels da edição. |
| **Configurações do site** | WhatsApp, Instagram, agenda do Cal.com, próximo Haja Day e métricas. |

Depois de salvar no painel, faça commit e push. O GitHub Actions publica o site sozinho em cerca de um minuto.

> O código do reel é o trecho depois de `/reel/` no link do Instagram. Em `instagram.com/hajaproducoesbrasil/reel/Dco2mE6hD3h/`, o código é `Dco2mE6hD3h`.

<p align="right"><a href="#topo">voltar ao topo ↑</a></p>

## Configurações: agenda, Haja Day e métricas

Tudo em **Configurações do site**, no painel (arquivo `src/content/site.yaml`):

- **Agenda (Cal.com):** crie uma conta gratuita em cal.com, um tipo de evento (por exemplo, "Gravação no estúdio") e cole o link curto, como `haja-producoes/estudio`. A página Agendar passa a mostrar a agenda. Com o campo vazio, ela usa o formulário pelo WhatsApp.
- **Próximo Haja Day:** com data e hora futuras, a página mostra a contagem regressiva. O link de inscrição pode ser um Google Forms ou um Tally. Sem data, aparece "Data em breve".
- **Métricas:** escolha **Plausible** (informe o domínio do site) ou **Umami** (informe o Website ID). As duas respeitam a privacidade e dispensam aviso de cookies. Os cliques em links externos, como o WhatsApp, também entram na contagem.

<p align="right"><a href="#topo">voltar ao topo ↑</a></p>

## Domínio próprio

1. Registre o domínio (ex.: `hajaproducoes.com.br` no registro.br).
2. No provedor de DNS, crie um registro `CNAME` de `www` para `rafascoelho22.github.io` e os registros `A` do domínio principal para os IPs do GitHub Pages (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`).
3. No GitHub: **Settings → Secrets and variables → Actions → Variables → New variable**, com nome `DOMINIO` e valor `hajaproducoes.com.br`.
4. Rode o workflow de novo (aba **Actions → Publicar no GitHub Pages → Run workflow**). O site passa a usar a raiz do domínio, o `CNAME` é gerado e os links, o sitemap e a imagem de compartilhamento se ajustam sozinhos.
5. Em **Settings → Pages**, marque **Enforce HTTPS**.

<p align="right"><a href="#topo">voltar ao topo ↑</a></p>

## Como foi feito

```mermaid
flowchart LR
  IG["Instagram<br/>@hajaproducoesbrasil"] -->|capas 360×640| PC["PhotoCraft<br/>ampliação 2× + nitidez"]
  PC -->|720×1280| CMS["Keystatic<br/>reels, faixas, edições"]
  SC["SoundCraft<br/>faixa de demonstração"] --> CMS
  FC["FigCraft<br/>design, banner,<br/>imagem de compartilhamento"] --> ASTRO
  CMS --> ASTRO["Astro 7<br/>páginas estáticas + WebP"]
  ASTRO -->|GitHub Actions| PAGES["GitHub Pages"]
```

| Ferramenta | Onde | O que fez |
|---|---|---|
| **FigCraft** | `figcraft/gerar.sh`, `banner.sh`, `og.sh` | Design desktop e mobile, design system, banner deste README e a imagem de compartilhamento 1200×630. |
| **PhotoCraft** | `scripts/melhorar-reels.sh` | Ampliou as capas de 360×640 para 720×1280 e aplicou *smart sharpen* com redução de ruído. Também cortou as capturas de celular deste README. |
| **SoundCraft** | `som/gerar-demo.sh` | Compôs e mixou a faixa de demonstração do player (pad, arpejo, baixo e batida, 80 BPM) e exportou em FLAC normalizado. |
| **Astro** | `src/` | Páginas, componentes, otimização de imagem e sitemap. |
| **Keystatic** | `keystatic.config.ts` | Painel de conteúdo. Só roda no `npm run dev`, então o site publicado continua 100% estático. |

<p align="right"><a href="#topo">voltar ao topo ↑</a></p>

## Estrutura de pastas

```
haja-site/
├── src/
│   ├── pages/              # index, portfolio, som, haja-day, agendar, 404
│   ├── layouts/Base.astro  # <head> com SEO, menu, rodapé, WhatsApp flutuante
│   ├── components/         # Reel, FundoLogo, Icones
│   ├── content/            # conteúdo editado pelo Keystatic (YAML)
│   │   ├── reels/  faixas/  edicoes/
│   │   └── site.yaml       # configurações
│   ├── assets/reels/       # capas (otimizadas no build)
│   ├── scripts/            # comportamentos de rolagem e menu
│   └── styles/             # global.css + paginas.css
├── public/                 # og.png, favicon, áudio, logo
├── keystatic.config.ts
├── astro.config.mjs
├── figcraft/  som/  scripts/   # fontes do design, do áudio e das imagens
├── img/ig/                 # capas originais baixadas do Instagram
├── docs/                   # banner e capturas deste README
└── .github/workflows/pages.yml
```

## Rodar localmente

Precisa do [Node.js](https://nodejs.org) 22.23 ou mais novo.

```bash
npm install
npm run dev       # site + painel em http://127.0.0.1:4321 (painel em /keystatic)
npm run build     # gera o site em dist/
npm run preview   # serve dist/ em http://localhost:4321/haja-site/
```

Para refazer os arquivos da suíte ArtCraft (instalada em `C:\Program Files\ArtCraft\`):

```bash
cd figcraft && bash gerar.sh && bash banner.sh && bash og.sh && cd ..
bash scripts/melhorar-reels.sh
bash som/gerar-demo.sh
```

<p align="right"><a href="#topo">voltar ao topo ↑</a></p>

## Próximos passos

- [x] Revelação por rolagem e reels no formato Instagram
- [x] Astro + Keystatic, com a equipe editando sem código
- [x] Portfólio filtrável
- [x] Player de áudio com forma de onda
- [x] Página do Haja Day com contagem regressiva
- [x] Agendamento (Cal.com ou WhatsApp)
- [x] SEO, sitemap, imagem de compartilhamento e métricas opcionais
- [x] Preparado para domínio próprio
- [ ] Trocar as capas pelos **vídeos originais**, tocando em loop, e abrir um player estilo Stories ao clicar
- [ ] Subir as **produções musicais reais** no lugar da faixa de demonstração
- [ ] Rolagem com inércia (Lenis) e animações com GSAP ScrollTrigger
- [ ] Depoimentos de artistas e ministérios

## Créditos e direitos

- Marca, logo, fotos e vídeos: **Haja Produções Brasil** ([@hajaproducoesbrasil](https://www.instagram.com/hajaproducoesbrasil/), [@hajaproducoesglobal](https://www.instagram.com/hajaproducoesglobal/)). Todos os direitos reservados. As imagens estão aqui como conteúdo do site da própria Haja.
- A faixa em `public/audio/faixa-de-demonstracao/` é um exemplo gerado no SoundCraft, não uma produção da Haja.
- Fontes: [Montserrat](https://fonts.google.com/specimen/Montserrat) e [Inter](https://fonts.google.com/specimen/Inter), sob a SIL Open Font License.
- Estrutura deste README inspirada em [Best-README-Template](https://github.com/othneildrew/Best-README-Template) e [awesome-readme](https://github.com/matiassingers/awesome-readme).

<p align="right"><a href="#topo">voltar ao topo ↑</a></p>
