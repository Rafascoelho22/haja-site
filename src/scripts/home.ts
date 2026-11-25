import { reduzMovimento } from './base';

// Efeitos da página inicial ligados à rolagem.
export function iniciarHome() {
  const reduz = reduzMovimento();
  const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const estreito = matchMedia('(max-width:860px)');

  // manifesto: quebra em palavras (* = palavra em laranja)
  const frase = document.getElementById('frase')!;
  frase.innerHTML = frase.textContent!
    .split(' ')
    .map((w) => (w.startsWith('*') ? `<span class="w l">${w.slice(1)}</span>` : `<span class="w">${w}</span>`))
    .join(' ');
  const palavras = [...frase.querySelectorAll('.w')];

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

  const leque = [...document.querySelectorAll<HTMLElement>('#leque .reel')];
  const manifesto = document.getElementById('manifesto')!;
  const galeria = document.getElementById('galeria')!;
  const trilho = document.getElementById('trilho')!;
  const day = document.getElementById('day')!;
  const dayReels = [...document.querySelectorAll<HTMLElement>('#dayReels .reel')];
  let distGaleria = 0;

  const medir = () => {
    if (estreito.matches) {
      galeria.style.height = '';
      distGaleria = 0;
      return;
    }
    distGaleria = Math.max(0, trilho.scrollWidth - innerWidth);
    galeria.style.height = `${innerHeight + distGaleria}px`;
  };

  const quadro = () => {
    if (reduz) return;
    const y = scrollY;
    const vh = innerHeight;
    const meio = Math.floor(leque.length / 2);

    const p = clamp(y / (vh * 0.7));
    leque.forEach((r, i) => {
      const d = i - meio;
      r.style.transform = `translateY(${Math.abs(d) * 24 * (1 - p)}px) rotate(${d * 5 * (1 - p)}deg) scale(${1 + p * (d === 0 ? 0.06 : 0.02)})`;
    });

    if (!estreito.matches) {
      const r = manifesto.getBoundingClientRect();
      const m = clamp((-r.top + vh * 0.25) / (r.height - vh * 0.9));
      const n = Math.round(m * palavras.length);
      palavras.forEach((w, i) => w.classList.toggle('on', i < n));
    }

    if (distGaleria) {
      const g = clamp(-galeria.getBoundingClientRect().top / distGaleria);
      trilho.style.transform = `translateX(${-g * distGaleria}px)`;
    }

    if (dayReels.length === 3) {
      const rd = day.getBoundingClientRect();
      const d = clamp(1 - (rd.top + rd.height * 0.3) / vh);
      dayReels[0].style.transform = `rotate(${-8 * d}deg) translateX(${-38 * d}%) translateY(${(1 - d) * 40}px)`;
      dayReels[2].style.transform = `rotate(${8 * d}deg) translateX(${38 * d}%) translateY(${(1 - d) * 40}px)`;
      dayReels[1].style.transform = `translateY(${(1 - d) * -20}px) scale(${0.96 + d * 0.04})`;
    }
  };

  let pedido = false;
  const agendar = () => {
    if (!pedido) {
      pedido = true;
      requestAnimationFrame(() => {
        pedido = false;
        quadro();
      });
    }
  };
  addEventListener('scroll', agendar, { passive: true });
  addEventListener('resize', () => {
    medir();
    agendar();
  });
  estreito.addEventListener('change', () => {
    medir();
    agendar();
  });
  addEventListener('load', () => {
    medir();
    quadro();
    const alvo = location.hash && document.getElementById(location.hash.slice(1));
    if (alvo) alvo.scrollIntoView({ behavior: 'instant' });
  });
  medir();
  quadro();
  if (estreito.matches || reduz) palavras.forEach((w) => w.classList.add('on'));
}
