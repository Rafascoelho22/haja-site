import { reduzMovimento } from './base';

// Efeitos da página inicial ligados à rolagem.
// Para não travar: cada efeito só roda enquanto a sua seção está na tela, todas as leituras
// de posição acontecem antes das escritas no mesmo quadro, e nada é reescrito se não mudou.
export function iniciarHome() {
  const reduz = reduzMovimento();
  // com animation-timeline, o leque, o manifesto, o trilho e o Haja Day andam só com CSS (paginas.css),
  // fora da thread principal; este código vira reserva e só mede o que o CSS precisa
  const pelaRolagemCss = !reduz && CSS.supports('animation-timeline: view()');
  const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const estreito = matchMedia('(max-width:860px)');

  // manifesto: quebra em palavras (* = palavra em laranja)
  const frase = document.getElementById('frase')!;
  frase.innerHTML = frase.textContent!
    .split(' ')
    .map((w, i) => (w.startsWith('*') ? `<span class="w l" style="--i:${i}">${w.slice(1)}</span>` : `<span class="w" style="--i:${i}">${w}</span>`))
    .join(' ');
  const palavras = [...frase.querySelectorAll('.w')];
  // cada palavra acende num trecho de 170vh dividido igualmente (a mesma conta do JS abaixo)
  frase.style.setProperty('--passo', `calc(170vh / ${palavras.length})`);

  // capítulos: troca o reel fixo na lateral
  const caps = [...document.querySelectorAll<HTMLElement>('.capitulo')];
  const pilha = [...document.querySelectorAll('#pilha .reel')];
  const pontos = [...document.querySelectorAll('#pontos span')];
  const ativar = (i: number) => {
    caps.forEach((c, k) => c.classList.toggle('ativo', k === i));
    pilha.forEach((r, k) => r.classList.toggle('ativo', k === i));
    pontos.forEach((p, k) => p.classList.toggle('ativo', k === i));
  };
  ativar(0);
  const capObs = new IntersectionObserver(
    (es) => es.forEach((e) => e.isIntersecting && ativar(Number((e.target as HTMLElement).dataset.reel))),
    { rootMargin: '-45% 0px -45% 0px' },
  );
  caps.forEach((c) => capObs.observe(c));

  const hero = document.getElementById('inicio')!;
  const leque = [...document.querySelectorAll<HTMLElement>('#leque .reel')];
  const manifesto = document.getElementById('manifesto')!;
  const galeria = document.getElementById('galeria')!;
  const trilho = document.getElementById('trilho')!;
  const day = document.getElementById('day')!;
  const dayReels = [...document.querySelectorAll<HTMLElement>('#dayReels .reel')];

  // quais seções estão na tela (com folga de meia tela)
  const visivel = new Set<Element>();
  const visObs = new IntersectionObserver(
    (es) => {
      es.forEach((e) => (e.isIntersecting ? visivel.add(e.target) : visivel.delete(e.target)));
      agendar();
    },
    { rootMargin: '50% 0px' },
  );
  [hero, manifesto, galeria, day].forEach((s) => visObs.observe(s));

  // posições medidas uma vez (e de novo ao redimensionar): ler o DOM a cada quadro custa caro
  let distGaleria = 0;
  let topo = { manifesto: 0, manifestoAlt: 0, galeria: 0, day: 0, dayAlt: 0 };
  const medir = () => {
    if (estreito.matches) {
      galeria.style.height = '';
      distGaleria = 0;
    } else {
      distGaleria = Math.max(0, trilho.scrollWidth - innerWidth);
      galeria.style.height = `${innerHeight + distGaleria}px`;
    }
    trilho.style.setProperty('--dist', `${distGaleria}px`);
    const abs = (el: HTMLElement) => el.getBoundingClientRect().top + scrollY;
    topo = {
      manifesto: abs(manifesto),
      manifestoAlt: manifesto.offsetHeight,
      galeria: abs(galeria),
      day: abs(day),
      dayAlt: day.offsetHeight,
    };
  };

  // o último valor escrito em cada elemento, para não reescrever o que não mudou
  const ultimo = new WeakMap<HTMLElement, string>();
  const transformar = (el: HTMLElement, valor: string) => {
    if (ultimo.get(el) !== valor) {
      ultimo.set(el, valor);
      el.style.transform = valor;
    }
  };
  let palavrasAcesas = -1;
  const r2 = (n: number) => Math.round(n * 100) / 100;

  const quadro = () => {
    if (reduz || pelaRolagemCss) return;
    const y = scrollY;
    const vh = innerHeight;

    if (visivel.has(hero)) {
      const p = r2(clamp(y / (vh * 0.7)));
      const meio = Math.floor(leque.length / 2);
      leque.forEach((r, i) => {
        const d = i - meio;
        transformar(r, `translateY(${r2(Math.abs(d) * 24 * (1 - p))}px) rotate(${r2(d * 5 * (1 - p))}deg) scale(${r2(1 + p * (d === 0 ? 0.06 : 0.02))})`);
      });
    }

    if (visivel.has(manifesto) && !estreito.matches) {
      const top = topo.manifesto - y;
      const m = clamp((-top + vh * 0.25) / (topo.manifestoAlt - vh * 0.9));
      const n = Math.round(m * palavras.length);
      if (n !== palavrasAcesas) {
        palavrasAcesas = n;
        palavras.forEach((w, i) => w.classList.toggle('on', i < n));
      }
    }

    if (distGaleria && visivel.has(galeria)) {
      const g = clamp((y - topo.galeria) / distGaleria);
      transformar(trilho, `translate3d(${Math.round(-g * distGaleria)}px,0,0)`);
    }

    if (dayReels.length === 3 && visivel.has(day)) {
      const d = r2(clamp(1 - (topo.day - y + topo.dayAlt * 0.3) / vh));
      transformar(dayReels[0], `rotate(${r2(-8 * d)}deg) translateX(${r2(-38 * d)}%) translateY(${r2((1 - d) * 40)}px)`);
      transformar(dayReels[2], `rotate(${r2(8 * d)}deg) translateX(${r2(38 * d)}%) translateY(${r2((1 - d) * 40)}px)`);
      transformar(dayReels[1], `translateY(${r2((1 - d) * -20)}px) scale(${r2(0.96 + d * 0.04)})`);
    }
  };

  let pedido = false;
  function agendar() {
    if (!pedido) {
      pedido = true;
      requestAnimationFrame(() => {
        pedido = false;
        quadro();
      });
    }
  }
  addEventListener('scroll', agendar, { passive: true });
  let espera = 0;
  const remedir = () => {
    clearTimeout(espera);
    espera = window.setTimeout(() => {
      medir();
      agendar();
    }, 120);
  };
  addEventListener('resize', remedir);
  estreito.addEventListener('change', remedir);
  // a altura das imagens e das fontes muda as posições: mede de novo quando tudo carregou
  addEventListener('load', () => {
    medir();
    quadro();
    const alvo = location.hash && document.getElementById(location.hash.slice(1));
    if (alvo) alvo.scrollIntoView({ behavior: 'instant' });
  });
  new ResizeObserver(remedir).observe(document.body);
  medir();
  quadro();
  if (estreito.matches || reduz) palavras.forEach((w) => w.classList.add('on'));

  // letreiro de artistas: no toque não há hover para pausar, então há um botão
  const pausa = document.getElementById('letreiroPausa');
  const letreiro = document.getElementById('letreiro');
  pausa?.addEventListener('click', () => {
    const pausado = letreiro!.classList.toggle('pausado');
    pausa.setAttribute('aria-pressed', String(pausado));
    pausa.setAttribute('aria-label', pausado ? 'Retomar o letreiro de artistas' : 'Pausar o letreiro de artistas');
  });
}
