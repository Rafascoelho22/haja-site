// Comportamentos comuns a todas as páginas: menu do celular, barra de progresso,
// barra clara sobre faixas claras e revelação ao rolar.
export const reduzMovimento = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function iniciarBase() {
  const nav = document.getElementById('nav')!;
  const barra = document.getElementById('progresso')!;
  const botao = document.getElementById('menuBotao')!;
  const fixaClara = nav.hasAttribute('data-nav-clara');

  // menu do celular
  const fechar = () => {
    nav.classList.remove('aberto');
    botao.setAttribute('aria-expanded', 'false');
    botao.setAttribute('aria-label', 'Abrir menu');
  };
  botao.addEventListener('click', () => {
    const abre = !nav.classList.contains('aberto');
    nav.classList.toggle('aberto', abre);
    botao.setAttribute('aria-expanded', String(abre));
    botao.setAttribute('aria-label', abre ? 'Fechar menu' : 'Abrir menu');
  });
  addEventListener('keydown', (e) => e.key === 'Escape' && fechar());
  nav.querySelectorAll('.links a').forEach((a) => a.addEventListener('click', fechar));

  // revelar ao rolar: só o que começa abaixo da dobra fica escondido
  if (!reduzMovimento()) {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.remove('pre');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    document.querySelectorAll<HTMLElement>('.rv').forEach((el, i) => {
      if (el.getBoundingClientRect().top > innerHeight) {
        el.classList.add('pre');
        if (el.dataset.atraso !== undefined) el.style.transitionDelay = `${(i % 3) * 90}ms`;
        io.observe(el);
      }
    });
  }

  // barra de progresso e cor da barra
  const claras = [...document.querySelectorAll<HTMLElement>('[data-faixa-clara]')];
  let pedido = false;
  const quadro = () => {
    pedido = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    barra.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    if (!fixaClara) {
      nav.classList.toggle(
        'claro',
        claras.some((s) => {
          const r = s.getBoundingClientRect();
          return r.top <= 26 && r.bottom > 26;
        }),
      );
    }
  };
  addEventListener('scroll', () => {
    if (!pedido) {
      pedido = true;
      requestAnimationFrame(quadro);
    }
  }, { passive: true });
  quadro();
}
