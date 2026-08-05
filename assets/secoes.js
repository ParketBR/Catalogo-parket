/* ─────────────────────────────────────────────────────────────
   Seções de pré-obra — as cinco etapas que acontecem antes da
   madeira, desenhadas em vez de fotografadas.

   Por que desenho e não foto: as cinco só existiam como banco de
   imagem — clip-art em 3D, embalagem de produto de outra marca,
   obra alheia com camiseta azul e cabo laranja. Nenhuma delas
   conversava com o papel quente e o traço fino do resto do site,
   e não há fotografia própria dessas etapas para pôr no lugar.

   Então falam a mesma língua das 16 pranchas e da pilha de
   camadas em piso.html: corte, traço fino, corpo em tinta
   rebaixada, rótulo em caixa alta puxado por linha de chamada.
   O que a etapa muda aparece em madeira — é a única cor.

   A chave é a numeração da LISTA BIBLIOTECA, a mesma de dados.js.
   categoria.js usa o desenho quando existe; sem ele, cai na foto.
   Todos partilham o viewBox 0 0 240 180: desenho até x=150,
   chamadas de 150 a 156, rótulo a partir de 160. O conteúdo de
   cada um ocupa mais ou menos a mesma faixa vertical (y 40 a 168)
   para que a troca entre etapas não faça o desenho pular na tela.

   Uma regra de cor, e só uma: a madeira marca o que ESTA etapa
   muda — a régua que sai, a lona, a manta, o plano final, o poro
   fechado. Todo o resto é tinta rebaixada, mesmo quando é madeira
   de verdade. É a mesma convenção da pilha do detalhamento, onde
   só a camada acesa ganha cor.
   ───────────────────────────────────────────────────────────── */
const SECOES = {

  /* 1.5 — o assoalho antigo sai e deixa a base à vista.
     Três réguas contam o tempo: a que ainda está, a que está
     saindo e o vazio pontilhado da que já saiu. */
  '1.5':
  '<svg class="sec" viewBox="0 0 240 180" role="img" aria-label="Corte: o assoalho antigo sai e deixa o contrapiso à vista">' +
    '<rect class="corpo" x="14" y="92" width="136" height="76"/>' +
    '<rect class="traco" x="14" y="92" width="136" height="76"/>' +
    '<rect class="madeira" x="14" y="78" width="40" height="14"/>' +
    '<rect class="traco" x="14" y="78" width="40" height="14"/>' +
    '<g transform="rotate(-18 58 92)">' +
      '<rect class="madeira" x="58" y="78" width="40" height="14"/>' +
      '<rect class="traco" x="58" y="78" width="40" height="14"/>' +
    '</g>' +
    '<rect class="fina" x="102" y="78" width="48" height="14" stroke-dasharray="4 3"/>' +
    '<path class="traco" d="M94 64 L150 46 H156"/>' +
    '<text class="rot forte" x="160" y="48">ASSOALHO SAI</text>' +
    '<path class="traco" d="M100 130 H156"/>' +
    '<text class="rot" x="160" y="132">CONTRAPISO</text>' +
  '</svg>',

  /* 1.1 — a pilha inteira entre a terra e a madeira. É o mesmo
     conteúdo do 3D que estava aqui antes, em corte e sem sombra. */
  '1.1':
  '<svg class="sec" viewBox="0 0 240 180" role="img" aria-label="Corte do piso em contato com o solo: terra, brita, lona, contrapiso e assoalho">' +
    '<rect class="corpo-2" x="14" y="120" width="136" height="48"/>' +
    '<rect class="traco" x="14" y="120" width="136" height="48"/>' +
    '<path class="fina" d="M26 168 L44 132 M56 168 L74 132 M86 168 L104 132 M116 168 L134 132"/>' +
    '<rect class="corpo" x="14" y="88" width="136" height="32"/>' +
    '<rect class="traco" x="14" y="88" width="136" height="32"/>' +
    '<g class="fina">' +
      '<circle cx="30" cy="100" r="3.5"/><circle cx="48" cy="110" r="3"/>' +
      '<circle cx="66" cy="98" r="3.5"/><circle cx="86" cy="109" r="3"/>' +
      '<circle cx="104" cy="99" r="3.5"/><circle cx="124" cy="109" r="3"/>' +
      '<circle cx="140" cy="99" r="3"/>' +
    '</g>' +
    /* a lona é a única em madeira: é ela que esta etapa acrescenta */
    '<rect class="madeira" x="14" y="82" width="136" height="6"/>' +
    '<path class="marca" d="M14 85 H150"/>' +
    '<rect class="corpo" x="14" y="46" width="136" height="36"/>' +
    '<rect class="traco" x="14" y="46" width="136" height="36"/>' +
    '<rect class="corpo-2" x="14" y="30" width="136" height="16"/>' +
    '<rect class="traco" x="14" y="30" width="136" height="16"/>' +
    '<path class="fina" d="M58 30 V46 M102 30 V46"/>' +
    '<path class="traco" d="M150 38 H156"/><text class="rot" x="160" y="40">ASSOALHO</text>' +
    '<path class="traco" d="M150 64 H156"/><text class="rot" x="160" y="66">CONTRAPISO</text>' +
    '<path class="traco" d="M150 85 H156"/><text class="rot forte" x="160" y="87">LONA</text>' +
    '<path class="traco" d="M150 104 H156"/><text class="rot" x="160" y="106">BRITA</text>' +
    '<path class="traco" d="M150 144 H156"/><text class="rot" x="160" y="146">TERRA</text>' +
  '</svg>',

  /* 1.3 — a manta é uma linha só, e o que ela tem de mais
     importante é não terminar no chão: sobe na parede. */
  '1.3':
  '<svg class="sec" viewBox="0 0 240 180" role="img" aria-label="Corte: manta contínua sobre o contrapiso, subindo na parede">' +
    '<rect class="corpo" x="14" y="24" width="18" height="144"/>' +
    '<rect class="traco" x="14" y="24" width="18" height="144"/>' +
    '<rect class="corpo" x="32" y="112" width="118" height="56"/>' +
    '<rect class="traco" x="32" y="112" width="118" height="56"/>' +
    '<path class="marca" d="M150 111 H33 V56"/>' +
    '<path class="traco" d="M96 111 L150 90 H156"/>' +
    '<text class="rot forte" x="160" y="92">MANTA</text>' +
    '<path class="traco" d="M33 64 L150 44 H156"/>' +
    '<text class="rot" x="160" y="46">SOBE NA PAREDE</text>' +
    '<path class="traco" d="M100 142 H156"/>' +
    '<text class="rot" x="160" y="144">CONTRAPISO</text>' +
  '</svg>',

  /* 1.2 — a onda é o contrapiso como ele é; a reta em cima é o
     que a massa devolve. O desenho é a diferença entre as duas.
     A onda é escrita em C puro (sem S) para poder ser repetida
     ao contrário no preenchimento de cima sem deslizar. */
  '1.2':
  '<svg class="sec" viewBox="0 0 240 180" role="img" aria-label="Corte: a massa autonivelante corrige o contrapiso irregular">' +
    '<path class="corpo" d="M14 116 C34 100 48 132 68 116 C88 100 102 132 122 116 ' +
      'C132 108 142 124 150 116 V168 H14 Z"/>' +
    '<path class="corpo-2" d="M14 76 H150 V116 C142 124 132 108 122 116 ' +
      'C102 132 88 100 68 116 C48 132 34 100 14 116 Z"/>' +
    '<path class="traco" d="M14 116 C34 100 48 132 68 116 C88 100 102 132 122 116 ' +
      'C132 108 142 124 150 116"/>' +
    '<path class="traco" d="M14 116 V168 H150 V116"/>' +
    '<path class="marca" d="M14 76 H150"/>' +
    '<path class="traco" d="M112 76 L150 64 H156"/>' +
    '<text class="rot forte" x="160" y="66">PLANO FINAL</text>' +
    '<path class="traco" d="M68 100 L150 44 H156"/>' +
    '<text class="rot" x="160" y="46">AUTONIVELANTE</text>' +
    '<path class="traco" d="M100 148 H156"/>' +
    '<text class="rot" x="160" y="150">CONTRAPISO</text>' +
  '</svg>',

  /* 1.4 — a mesma laje dos dois lados da linha pontilhada: à
     esquerda o poro aberto soltando pó, à direita o poro fechado
     e a superfície selada. */
  '1.4':
  '<svg class="sec" viewBox="0 0 240 180" role="img" aria-label="Corte: o endurecedor fecha os poros do contrapiso">' +
    '<rect class="corpo" x="14" y="62" width="136" height="106"/>' +
    '<rect class="traco" x="14" y="62" width="136" height="106"/>' +
    /* pó solto: só existe do lado que ainda não recebeu nada */
    '<g class="fina"><circle cx="30" cy="56" r="1.4"/><circle cx="46" cy="52" r="1.1"/>' +
      '<circle cx="64" cy="57" r="1.4"/></g>' +
    '<g class="traco">' +
      '<circle cx="26" cy="78" r="3"/><circle cx="44" cy="90" r="2.4"/>' +
      '<circle cx="60" cy="76" r="2.8"/><circle cx="70" cy="96" r="2.2"/>' +
      '<circle cx="32" cy="108" r="2.6"/><circle cx="60" cy="120" r="2"/>' +
    '</g>' +
    '<path class="fina" d="M82 62 V168" stroke-dasharray="3 3"/>' +
    '<g class="madeira">' +
      '<circle cx="94" cy="78" r="3"/><circle cx="112" cy="90" r="2.4"/>' +
      '<circle cx="128" cy="76" r="2.8"/><circle cx="138" cy="96" r="2.2"/>' +
      '<circle cx="100" cy="108" r="2.6"/><circle cx="128" cy="120" r="2"/>' +
    '</g>' +
    '<path class="marca" d="M82 62 H150"/>' +
    /* aqui os rótulos sobem para cima de cada metade em vez de irem
       para a régua da direita: são um par comparado, e duas linhas
       de chamada cruzando o desenho embaralhavam qual era qual */
    '<text class="rot" x="18" y="36">PORO ABERTO</text>' +
    '<path class="traco" d="M20 40 V50"/>' +
    '<text class="rot forte" x="90" y="36">PORO SELADO</text>' +
    '<path class="traco" d="M92 40 V56"/>' +
    '<path class="traco" d="M100 148 H156"/>' +
    '<text class="rot" x="160" y="150">CONTRAPISO</text>' +
  '</svg>',
};
