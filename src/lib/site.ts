import { getEntry, getCollection, type CollectionEntry } from 'astro:content';

/** Caminho interno respeitando o `base` (/haja-site/ no GitHub Pages, / com domínio próprio). */
export function url(caminho = '') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const limpo = caminho.replace(/^\//, '');
  return `${base}/${limpo}`;
}

export async function getSite() {
  const entrada = await getEntry('site', 'site');
  if (!entrada) throw new Error('src/content/site.yaml não encontrado');
  return entrada.data;
}

export function whatsapp(numero: string, mensagem?: string) {
  const texto = mensagem ? `?text=${encodeURIComponent(mensagem)}` : '';
  return `https://wa.me/${numero}${texto}`;
}

export const CATEGORIAS: Record<string, string> = {
  'ao-vivo': 'Louvor ao vivo',
  sessions: 'Sessions acústicas',
  bastidores: 'Bastidores',
  entrevistas: 'Entrevistas',
  'haja-day': 'Haja Day',
  redes: 'Conteúdo para redes',
};

export type Reel = CollectionEntry<'reels'>;

/** Reels do mais recente para o mais antigo. */
export async function getReels() {
  const reels = await getCollection('reels');
  return reels.sort((a, b) => (b.data.data?.getTime() ?? 0) - (a.data.data?.getTime() ?? 0));
}
