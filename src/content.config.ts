import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';
import { parse as parseYaml } from 'yaml';

const categoria = z.enum(['ao-vivo', 'sessions', 'bastidores', 'entrevistas', 'haja-day', 'redes']);

const reels = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/reels' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      legenda: z.string().default(''),
      categoria,
      capa: image(),
      instagram: z.string(),
      data: z.coerce.date().nullish(),
      destaque: z.boolean().default(false),
    }),
});

const faixas = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/faixas' }),
  schema: z.object({
    titulo: z.string(),
    artista: z.string().default(''),
    descricao: z.string().default(''),
    audio: z.string().nullish(),
    demonstracao: z.boolean().default(false),
    ordem: z.number().default(0),
  }),
});

const edicoes = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/edicoes' }),
  schema: z.object({
    titulo: z.string(),
    numero: z.number(),
    data: z.coerce.date().nullish(),
    resumo: z.string().default(''),
    reels: z.array(reference('reels')).default([]),
  }),
});

const site = defineCollection({
  loader: file('./src/content/site.yaml', { parser: (t) => ({ site: parseYaml(t) }) }),
  schema: z.object({
    whatsapp: z.string(),
    whatsappExibicao: z.string(),
    instagram: z.string(),
    calLink: z.string().nullish(),
    proximoHajaDay: z
      .object({
        data: z.coerce.date().nullish(),
        local: z.string().nullish(),
        inscricaoUrl: z.string().nullish(),
      })
      .default({}),
    analytics: z
      .object({
        provedor: z.enum(['nenhum', 'plausible', 'umami']).default('nenhum'),
        id: z.string().nullish(),
        scriptUrl: z.string().nullish(),
      })
      .default({ provedor: 'nenhum' }),
  }),
});


export const collections = { reels, faixas, edicoes, site };
