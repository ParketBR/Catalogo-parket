/* ─────────────────────────────────────────────────────────────
   Preços — FORRO. Tabela recebida em 04/08/2026.

   Ainda não há detalhamento de forro no site: forro.html é página
   de categoria, sem índice de pranchas nem escopo. Este arquivo
   fica pronto e NÃO é carregado por nenhuma página — os valores
   estão guardados, esperando o módulo.

   Não misturar com precos.js, que é do piso. Nenhum item daqui
   tem correspondente lá.

   Unidades: UNI = unidade · MTL = metro linear · M2 = metro quadrado
   ───────────────────────────────────────────────────────────── */
const PRECOS_FORRO = {
  'recorte-luminaria':        { nome:'Recorte para luminária',                    un:'UNI', valor:60 },
  'recorte-led-linear':       { nome:'Recorte para LED linear',                   un:'MTL', valor:85 },
  'recorte-grelha-ar':        { nome:'Recorte para grelha de ar condicionado',    un:'UNI', valor:650 },
  'grelha-frisada':           { nome:'Grelha frisada',                            un:'UNI', valor:650 },
  'reforco-pendente':         { nome:'Reforço para pendente',                     un:'UNI', valor:320 },
  'sanca-iluminada':          { nome:'Sanca iluminada',                           un:'MTL', valor:980 },
  'bando-15-30':              { nome:'Bandô 15cm a 30cm',                         un:'MTL', valor:890 },
  'bando-30-40':              { nome:'Bandô 30cm a 40cm',                         un:'MTL', valor:1080 },
  'cortineiro':               { nome:'Cortineiro',                                un:'MTL', valor:980 },
  'alcapao-simples':          { nome:'Alçapão simples (até 60×60cm)',             un:'UNI', valor:750 },
  'alcapao-grande':           { nome:'Alçapão grande (a partir de 80×80cm)',      un:'UNI', valor:1280 },
  'caixa-som-frisada':        { nome:'Caixa de som frisada',                      un:'UNI', valor:175 },
  'caixa-som-acustica':       { nome:'Caixa de som com revestimento acústico',    un:'UNI', valor:238 },
  'flap-tv':                  { nome:'Flap TV',                                   un:'UNI', valor:1620 },
  'tabica-simples':           { nome:'Tabica simples',                            un:'MTL', valor:50 },
  'tabica-retorno-ar':        { nome:'Tabica com retorno de ar',                  un:'MTL', valor:80 },
};
