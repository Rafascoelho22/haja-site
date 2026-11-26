// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import node from '@astrojs/node';
import keystatic from '@keystatic/astro';

// O painel do Keystatic (/keystatic) roda só no `npm run dev`: o site publicado continua 100% estático.
const dev = process.argv.includes('dev');

// Domínio próprio: defina a variável DOMINIO (ex.: hajaproducoes.com.br) no GitHub
// (Settings → Secrets and variables → Actions → Variables) e o site passa a usar a raiz desse domínio.
const dominio = process.env.DOMINIO?.trim();

export default defineConfig({
  site: dominio ? `https://${dominio}` : 'https://rafascoelho22.github.io',
  // no dev o site roda na raiz, porque o painel do Keystatic chama /api/keystatic sem o base
  base: dev || dominio ? '/' : '/haja-site',
  trailingSlash: dev ? 'ignore' : 'always',
  integrations: [sitemap(), ...(dev ? [react(), keystatic()] : [])],
  ...(dev ? { adapter: node({ mode: 'standalone' }) } : {}),
  image: { responsiveStyles: true },
  // fontes baixadas no build e servidas pelo próprio site (sem esperar o Google Fonts)
  fonts: [
    { provider: fontProviders.google(), name: 'Montserrat', cssVariable: '--fonte-display', weights: [600, 800, 900], subsets: ['latin'], fallbacks: ['Arial Black', 'sans-serif'] },
    { provider: fontProviders.google(), name: 'Inter', cssVariable: '--fonte-corpo', weights: [400, 500, 600], subsets: ['latin'], fallbacks: ['system-ui', 'sans-serif'] },
  ],
});
