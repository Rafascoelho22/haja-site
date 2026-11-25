// @ts-check
import { defineConfig } from 'astro/config';
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
});
