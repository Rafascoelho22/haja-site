// Comportamentos comuns a todas as páginas: rótulo do menu do celular, barra de progresso,
// barra clara sobre faixas claras e revelação ao rolar.
export const reduzMovimento = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** O navegador anima pela rolagem só com CSS (paginas.css)? Então o JS abaixo não precisa rodar. */
const cssPelaRolagem = () => !reduzMovimento() && CSS.supports('animation-timeline: view()');

export function iniciarBase() {
  const nav = document.getElementById('nav')!;
  const barra = document.getElementById('progresso')!;
  const botao = document.getElementById('menuBotao')!;
  const fixaClara = nav.hasAttribute('data-nav-clara');

  // menu do celular
  const menu = document.getElementById('menu')!;
  const rotular = (aberto: boolean) => {
    botao.setAttribute('aria-expanded', String(aberto));
    botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  };
  if ('popover' in HTMLElement.prototype) {
    // popover nativo: o botão abre e fecha pelo HTML (commandfor/popovertarget), e Esc e o toque fora
    // fecham sozinhos. O JS só acerta o rótulo do botão e fecha o menu ao escolher um link.
    const fechar = () => menu.matches(':popover-open') && menu.hidePopover();
    menu.addEventListener('toggle', (e) => rotular((e as ToggleEvent).newState === 'open'));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', fechar));
    matchMedia('(min-width:861px)').addEventListener('change', (e) => e.matches && fechar());
  } else {
    // reserva para navegador sem popover: o mesmo menu, aberto por uma classe
    const fechar = () => {
      nav.classList.remove('aberto');
      rotular(false);
    };
    botao.addEventListener('click', () => {
      const abre = !nav.classList.contains('aberto');
      nav.classList.toggle('aberto', abre);
      rotular(abre);
    });
    addEventListener('keydown', (e) => e.key === 'Escape' && fechar());
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', fechar));
  }

  // revelar ao rolar: só o que começa abaixo da dobra fica escondido
  if (!reduzMovimento() && !cssPelaRolagem()) {
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
    document.querySelectorAll<HTMLElement>('.rv').forEach((el) => {
      if (el.getBoundingClientRect().top > innerHeight) {
        el.classList.add('pre');
        if (el.dataset.atraso !== undefined) el.style.transitionDelay = `${([...el.parentElement!.children].indexOf(el) % 3) * 90}ms`;
        io.observe(el);
      }
    });
  }

  // cor da barra: fica clara enquanto uma faixa clara passa por baixo dela.
  // Um IntersectionObserver numa faixa fina no topo evita ler posições a cada quadro.
  if (!fixaClara) {
    const sob = new Set<Element>();
    const obs = new IntersectionObserver(
      (es) => {
        es.forEach((e) => (e.isIntersecting ? sob.add(e.target) : sob.delete(e.target)));
        nav.classList.toggle('claro', sob.size > 0);
      },
      { rootMargin: '-26px 0px -94% 0px' },
    );
    document.querySelectorAll('[data-faixa-clara]').forEach((s) => obs.observe(s));
  }

  // barra de progresso: a altura da página só é medida de novo quando ela muda
  if (cssPelaRolagem()) return;
  let max = 1;
  const medirMax = () => (max = Math.max(1, document.documentElement.scrollHeight - innerHeight));
  new ResizeObserver(medirMax).observe(document.body);
  addEventListener('resize', medirMax);
  medirMax();
  let ultimo = '';
  let pedido = false;
  const quadro = () => {
    pedido = false;
    const v = `scaleX(${Math.min(1, scrollY / max).toFixed(3)})`;
    if (v !== ultimo) barra.style.transform = ultimo = v;
  };
  addEventListener('scroll', () => {
    if (!pedido) {
      pedido = true;
      requestAnimationFrame(quadro);
    }
  }, { passive: true });
  quadro();
}
