/* ─────────────────────────────────────────────────────────────
   Definição técnica — os ambientes do contrato.

   ATENÇÃO: isto é um contrato de exemplo, escrito à mão. No
   sistema de verdade estes dados chegam da importação do
   contrato, e este arquivo deixa de existir. Ele está aqui para
   a tela poder ser usada e julgada antes de haver integração —
   nada nesta pasta fala com banco de dados.

   Cada ambiente é independente: a mesma obra pode ter piso
   aquecido na suíte e não ter no home theater. Por isso a
   configuração mora no ambiente, nunca no projeto.

   `blocos` diz quais assuntos aparecem para aquele ambiente —
   é o que evita mostrar opção de deck para um quarto.
   ───────────────────────────────────────────────────────────── */
const CONTRATO = {
  obra: 'Residência Alto de Pinheiros',
  cliente: 'Contrato 2026-0417',
  ambientes: [
    { num:'1.1', nome:'Home Theater',           produto:'Tauari Chevron', area:15, blocos:['piso'] },
    { num:'1.2', nome:'Circulação Superior',    produto:'Tauari Chevron', area:26, blocos:['piso'] },
    { num:'1.3', nome:'Circulação Suíte Master',produto:'Tauari Chevron', area:11, blocos:['piso'] },
    { num:'1.4', nome:'Suíte Master',           produto:'Tauari Chevron', area:21, blocos:['piso'] },
    { num:'1.5', nome:'Sala de Estar',          produto:'Tauari Chevron', area:38, blocos:['piso'] },
    { num:'1.6', nome:'Hall de Entrada',        produto:'Tauari Chevron', area:9,  blocos:['piso'] },
    { num:'2.1', nome:'Deck Piscina',           produto:'Cumaru',         area:16, blocos:['deck'] },
    { num:'2.2', nome:'Varanda Gourmet',        produto:'Cumaru',         area:24, blocos:['deck'] },
    { num:'3.1', nome:'Escada Principal',       produto:'Tauari',         area:7,  blocos:['escada'] },
  ],
};

/* Para onde um ambiente pode fazer transição. São os ambientes do
   contrato mais os vizinhos que a Parket não executa mas que
   encostam no piso — é neles que mora quase toda transição, e sem
   eles a lista de destinos ficaria falsa. */
const DESTINOS_EXTERNOS = [
  'Banheiro', 'Lavabo', 'Cozinha', 'Área de serviço',
  'Área externa', 'Sacada', 'Closet',
];
