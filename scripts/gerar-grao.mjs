// Gera src/assets/grao.png: ruído de granulado de filme, 128×128, que se repete sem emenda.
// É uma imagem fixa (cerca de 20 KB): nada de filtro SVG ao vivo, que custa caro na rolagem.
// Uso: node scripts/gerar-grao.mjs
import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const L = 128;
let semente = 7;
const aleatorio = () => ((semente = (semente * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);

// cada pixel: cinza claro ou escuro, com transparência variada
const linhas = Buffer.alloc((L * 4 + 1) * L);
for (let y = 0; y < L; y++) {
  const o = y * (L * 4 + 1);
  linhas[o] = 0; // sem filtro PNG
  for (let x = 0; x < L; x++) {
    const p = o + 1 + x * 4;
    const v = aleatorio() < 0.5 ? 0 : 255;
    linhas[p] = linhas[p + 1] = linhas[p + 2] = v;
    linhas[p + 3] = Math.floor(aleatorio() ** 2 * 90);
  }
}

const crcTabela = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc = (b) => {
  let c = 0xffffffff;
  for (const x of b) c = crcTabela[(c ^ x) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const bloco = (tipo, dados) => {
  const t = Buffer.from(tipo);
  const tam = Buffer.alloc(4);
  tam.writeUInt32BE(dados.length);
  const c = Buffer.alloc(4);
  c.writeUInt32BE(crc(Buffer.concat([t, dados])));
  return Buffer.concat([tam, t, dados, c]);
};
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(L, 0);
ihdr.writeUInt32BE(L, 4);
ihdr[8] = 8; // 8 bits
ihdr[9] = 6; // RGBA
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  bloco('IHDR', ihdr),
  bloco('IDAT', deflateSync(linhas, { level: 9 })),
  bloco('IEND', Buffer.alloc(0)),
]);
writeFileSync(new URL('../src/assets/grao.png', import.meta.url), png);
console.log(`src/assets/grao.png: ${png.length} bytes`);
