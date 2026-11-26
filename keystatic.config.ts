import { config, fields, collection, singleton } from '@keystatic/core';

export const CATEGORIAS = [
  { label: 'Louvor ao vivo', value: 'ao-vivo' },
  { label: 'Sessions acústicas', value: 'sessions' },
  { label: 'Bastidores', value: 'bastidores' },
  { label: 'Entrevistas e testemunhos', value: 'entrevistas' },
  { label: 'Haja Day', value: 'haja-day' },
  { label: 'Conteúdo para redes', value: 'redes' },
] as const;

export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: 'Haja Produções' },
    navigation: {
      Conteúdo: ['reels', 'clipes', 'artistas', 'faixas', 'edicoes'],
      Site: ['site'],
    },
  },
  collections: {
    reels: collection({
      label: 'Reels',
      slugField: 'titulo',
      path: 'src/content/reels/*',
      format: { data: 'yaml' },
      columns: ['titulo', 'artista', 'categoria', 'data'],
      schema: {
        titulo: fields.slug({ name: { label: 'Título', description: 'Nome da música, quando houver.' } }),
        artista: fields.text({ label: 'Artista ou ministério', description: 'Aparece junto do título. Deixe vazio em vídeos da própria Haja.' }),
        legenda: fields.text({ label: 'Legenda curta', description: 'Aparece sobre o reel, como no Instagram.' }),
        categoria: fields.select({ label: 'Categoria', options: [...CATEGORIAS], defaultValue: 'sessions' }),
        capa: fields.image({
          label: 'Capa (vertical 9:16)',
          directory: 'src/assets/reels',
          publicPath: '../../assets/reels/',
          validation: { isRequired: true },
        }),
        instagram: fields.text({
          label: 'Código do reel no Instagram',
          description: 'O trecho depois de /reel/ no link. Ex.: Dco2mE6hD3h',
          validation: { length: { min: 5 } },
        }),
        data: fields.date({ label: 'Data de publicação' }),
        destaque: fields.checkbox({ label: 'Mostrar na página inicial', defaultValue: false }),
      },
    }),
    faixas: collection({
      label: 'Faixas de áudio',
      slugField: 'titulo',
      path: 'src/content/faixas/*',
      format: { data: 'yaml' },
      schema: {
        titulo: fields.slug({ name: { label: 'Título' } }),
        artista: fields.text({ label: 'Artista ou ministério' }),
        descricao: fields.text({ label: 'O que foi feito', multiline: true }),
        audio: fields.file({ label: 'Arquivo de áudio (mp3 ou wav)', directory: 'public/audio', publicPath: '/audio/' }),
        audioAntes: fields.file({
          label: 'Versão antes da mixagem (opcional)',
          description: 'Com ela, o player ganha o botão Antes/Depois, que troca de versão no mesmo ponto da música.',
          directory: 'public/audio',
          publicPath: '/audio/',
        }),
        demonstracao: fields.checkbox({
          label: 'Faixa de demonstração',
          description: 'Marque enquanto for um áudio de exemplo, não uma produção real.',
          defaultValue: false,
        }),
        ordem: fields.integer({ label: 'Ordem', defaultValue: 0 }),
      },
    }),
    clipes: collection({
      label: 'Clipes no YouTube',
      slugField: 'titulo',
      path: 'src/content/clipes/*',
      format: { data: 'yaml' },
      columns: ['titulo', 'artista', 'data'],
      schema: {
        titulo: fields.slug({ name: { label: 'Título' } }),
        artista: fields.text({ label: 'Artista ou ministério' }),
        youtube: fields.text({
          label: 'Código do vídeo no YouTube',
          description: 'Os 11 caracteres depois de watch?v= no link. Ex.: 1zBxeo8mXkc',
          validation: { length: { min: 11, max: 11 } },
        }),
        tipo: fields.select({
          label: 'Tipo',
          options: [
            { label: 'Clipe oficial', value: 'clipe' },
            { label: 'Ao vivo', value: 'ao-vivo' },
          ],
          defaultValue: 'clipe',
        }),
        data: fields.date({ label: 'Data de publicação' }),
      },
    }),
    artistas: collection({
      label: 'Artistas atendidos',
      slugField: 'nome',
      path: 'src/content/artistas/*',
      format: { data: 'yaml' },
      columns: ['nome', 'instagram'],
      schema: {
        nome: fields.slug({ name: { label: 'Nome' } }),
        instagram: fields.text({ label: 'Instagram (sem @)' }),
        link: fields.url({ label: 'Link de um trabalho com a Haja', description: 'Clipe no YouTube ou reel. Sem link, o nome leva ao Instagram do artista.' }),
        ordem: fields.integer({ label: 'Ordem', defaultValue: 0 }),
      },
    }),
    edicoes: collection({
      label: 'Edições do Haja Day',
      slugField: 'titulo',
      path: 'src/content/edicoes/*',
      format: { data: 'yaml' },
      schema: {
        titulo: fields.slug({ name: { label: 'Título' } }),
        numero: fields.integer({ label: 'Número da edição', validation: { isRequired: true } }),
        data: fields.date({ label: 'Data do evento (se souber)' }),
        resumo: fields.text({ label: 'Resumo', multiline: true }),
        reels: fields.array(fields.relationship({ label: 'Reel', collection: 'reels' }), {
          label: 'Reels desta edição',
          itemLabel: (p) => p.value ?? 'Escolha um reel',
        }),
      },
    }),
  },
  singletons: {
    site: singleton({
      label: 'Configurações do site',
      path: 'src/content/site',
      format: { data: 'yaml' },
      schema: {
        whatsapp: fields.text({ label: 'WhatsApp (só números, com DDI)', defaultValue: '5527997661514' }),
        whatsappExibicao: fields.text({ label: 'WhatsApp como aparece no site', defaultValue: '+55 27 99766-1514' }),
        instagram: fields.text({ label: 'Usuário do Instagram', defaultValue: 'hajaproducoesbrasil' }),
        instagramGlobal: fields.text({ label: 'Instagram da Haja Global (sem @)', defaultValue: 'hajaproducoesglobal' }),
        youtube: fields.text({ label: 'Canal do YouTube (sem @)', defaultValue: 'hajaproducoes' }),
        buttondown: fields.text({
          label: 'Usuário do Buttondown (lista de espera do Haja Day)',
          description: 'Com ele, a página do Haja Day mostra um campo de e-mail. Vazio: só o aviso pelo WhatsApp.',
        }),
        calLink: fields.text({
          label: 'Link do Cal.com para agendamento',
          description: 'Ex.: haja-producoes/estudio. Deixe vazio para agendar pelo WhatsApp.',
        }),
        proximoHajaDay: fields.object(
          {
            data: fields.datetime({ label: 'Data e hora da próxima edição' }),
            local: fields.text({ label: 'Local' }),
            inscricaoUrl: fields.url({ label: 'Link de inscrição (formulário)' }),
          },
          { label: 'Próximo Haja Day' },
        ),
        analytics: fields.object(
          {
            provedor: fields.select({
              label: 'Ferramenta de métricas',
              options: [
                { label: 'Nenhuma', value: 'nenhum' },
                { label: 'Plausible', value: 'plausible' },
                { label: 'Umami', value: 'umami' },
              ],
              defaultValue: 'nenhum',
            }),
            id: fields.text({ label: 'Domínio (Plausible) ou Website ID (Umami)' }),
            scriptUrl: fields.url({ label: 'Endereço do script (só para Umami próprio)' }),
          },
          { label: 'Métricas' },
        ),
      },
    }),
  },
});
