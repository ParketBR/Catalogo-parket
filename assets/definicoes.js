/* ─────────────────────────────────────────────────────────────
   As definições técnicas de um ambiente de piso.

   Fonte única. Antes o conjunto estava espalhado: o índice de
   piso.html lia DETALHES direto, a Central tinha a sua própria
   lista, e faltava tudo o que não tem prancha desenhada. Aqui é
   um lugar só, e as telas leem daqui.

   ── de onde vem cada opção ───────────────────────────────────
   · `ref` aponta para um grupo de DETALHES (dados.js): o nome, o
     texto e a prancha do DXF saem de lá, sem cópia. São as que
     têm desenho de obra.
   · `opcoes` escrito à mão é para o que ainda não tem prancha —
     modelo de instalação, soleira, junta, acabamento. Fica sem
     imagem de propósito: melhor cartão de texto do que banco de
     imagem (ver o cabeçalho de secoes.js).

   ── cota ────────────────────────────────────────────────────
   `cota` é quanto aquela escolha acrescenta à espessura do
   sistema, em milímetros. É o campo que converte escolha em
   consequência para marcenaria e portas — some tudo e o ambiente
   sabe quanto o piso subiu. Os números aqui são de ordem de
   grandeza e precisam ser fixados pela Parket.

   `aditivo:true` marca o que é serviço adicional em contrato.
   ───────────────────────────────────────────────────────────── */

/* puxa as variantes de um grupo de DETALHES para o formato de opção */
function _deDetalhe(num, extras){
  var g = null;
  if (typeof DETALHES !== 'undefined') {
    DETALHES.forEach(function(d){ if (d.num === num) g = d; });
  }
  if (!g) return [];
  return g.itens.map(function(it, k){
    var o = {
      id: it.num, nome: it.nome, img: it.img,
      desc: it.muda || it.titulo, texto: it.texto, titulo: it.titulo,
    };
    var e = extras && extras[k];
    if (e) for (var p in e) o[p] = e[p];
    return o;
  });
}

const BLOCOS_DEF = [
  { id:'sistema',    nome:'Sistema'    },
  { id:'geometria',  nome:'Geometria'  },
  { id:'encontros',  nome:'Encontros'  },
  { id:'recortes',   nome:'Recortes'   },
  { id:'acabamento', nome:'Acabamento' },
  { id:'notas',      nome:'Notas'      },
];

const DEFINICOES = [

  /* ── sistema ───────────────────────────────────────────── */
  { id:'instalacao', bloco:'sistema', nome:'Modelo de instalação',
    pergunta:'Como a régua se prende à base?',
    nota:'É a decisão que governa todas as outras: aquecimento, rodapé, junta e cota final.',
    tipo:'opcao', obrigatorio:true,
    opcoes:[
      { id:'colado', nome:'Colado', img:'sistema-instalacao', cota:2,
        desc:'Apoiada em toda a face, sobre cola PU.',
        texto:'Contrapiso regularizado, cola PU e assoalho. A régua fica apoiada em toda a face, sem vão e sem sarrafo — é o que dá o som cheio ao pisar. Exige contrapiso curado, plano e endurecido.' },
      { id:'flutuante', nome:'Flutuante', cota:4,
        desc:'Sobre manta, sem fixação à base.',
        texto:'A régua se encaixa nela mesma e corre solta sobre uma manta. Dispensa cola e aceita base menos perfeita, mas soa mais oco, pede folga perimetral maior e limita a área contínua sem junta.' },
      { id:'pregado', nome:'Pregado', cota:24,
        desc:'Sobre barrotes, pregada.',
        texto:'A régua é pregada em barrotes assentados sobre a base. É o sistema tradicional de assoalho; levanta bastante a cota e cria vão de ar sob o piso.' },
    ]},

  { id:'elevado', bloco:'sistema', ref:'2.4', nome:'Piso elevado',
    pergunta:'O piso sobe da laje?',
    tipo:'opcao', recusa:'Não sobe', aditivo:true,
    cotaRecusa:0, opcoes:_deDetalhe('2.4', [{ cota:70 }, { cota:45 }]) },

  { id:'aquecido', bloco:'sistema', ref:'2.5', nome:'Piso aquecido',
    pergunta:'Vai ter piso aquecido?',
    tipo:'sim-nao', aditivo:true,
    opcoes:_deDetalhe('2.5', [{ cota:12 }]) },

  /* ── geometria ─────────────────────────────────────────── */
  { id:'paginacao', bloco:'geometria', ref:'2.1', nome:'Paginação',
    pergunta:'Qual o desenho do piso neste ambiente?',
    nota:'A paginação é por ambiente: a sala pode ser chevron e o closet reto. Ela decide o corte, a perda de material e o ponto de partida.',
    tipo:'opcao', obrigatorio:true,
    /* perda é o índice de material adicional que a paginação come.
       Entra direto no quantitativo. Números a fechar pela Parket. */
    opcoes:_deDetalhe('2.1', [
      { perda:.08 }, { perda:.18 }, { perda:.15 },
      { perda:.12 }, { perda:.20 }, { perda:.22 },
    ])},

  { id:'sentido', bloco:'geometria', nome:'Sentido da instalação',
    pergunta:'Em que direção a régua corre?',
    nota:'O sentido acompanha a circulação e a luz. É ele que decide onde caem as emendas.',
    tipo:'sentido', obrigatorio:true,
    opcoes:[
      { id:'0',   nome:'0°',   desc:'Régua no sentido do maior lado.' },
      { id:'90',  nome:'90°',  desc:'Régua atravessando o ambiente.' },
      { id:'45',  nome:'45°',  desc:'Diagonal — acompanha a entrada.' },
      { id:'135', nome:'135°', desc:'Diagonal invertida.' },
    ]},

  { id:'partida', bloco:'geometria', ref:'2.3', nome:'Ponto de partida',
    pergunta:'De onde sai a primeira régua?',
    nota:'Marca-se no projeto; na obra já é tarde.',
    tipo:'opcao', obrigatorio:true,
    opcoes:[
      { id:'2.3.1', nome:'Eixo do ambiente', img:'inicio-paginacao',
        desc:'Sobra igual nas duas paredes.',
        texto:'A paginação parte do centro e sobra a mesma régua dos dois lados. É o que Versailles e tabeira exigem, e o que dá o desenho mais equilibrado.' },
      { id:'2.3.2', nome:'Régua inteira na entrada', img:'inicio-paginacao',
        desc:'O corte fica na parede oposta.',
        texto:'A primeira régua entra inteira na soleira, e toda a sobra vai para a parede do fundo. É a escolha quando a entrada é o ponto que o olho encontra primeiro.' },
      { id:'2.3.3', nome:'Alinhado à esquadria', img:'inicio-paginacao',
        desc:'A régua acompanha o caixilho.',
        texto:'A paginação é travada pela linha da esquadria, para que a régua e o caixilho não briguem. Usa-se quando a fachada é envidraçada e a junta ficaria à vista.' },
    ]},

  /* ── encontros ─────────────────────────────────────────── */
  { id:'rodape', bloco:'encontros', ref:'3.1', nome:'Rodapé',
    pergunta:'Como o piso encontra a parede?',
    tipo:'opcao', obrigatorio:true,
    opcoes:_deDetalhe('3.1'),
    /* o modelo não basta para o executivo: altura, espessura e
       acabamento entram no memorial e na ordem de produção */
    campos:[
      { id:'altura',    rotulo:'Altura',     tipo:'medida', unidade:'mm', sugestoes:[70,100,150,200] },
      { id:'espessura', rotulo:'Espessura',  tipo:'medida', unidade:'mm', sugestoes:[10,15,20] },
      { id:'acabamento',rotulo:'Acabamento', tipo:'texto',  placeholder:'mesma madeira, laca branca…' },
    ]},

  { id:'transicoes', bloco:'encontros', nome:'Transições',
    pergunta:'Com quais ambientes este encosta?',
    nota:'Cada encontro tem a sua própria solução — um ambiente pode ter várias.',
    tipo:'transicoes', refPeca:'2.6', refPosicao:'2.7' },

  { id:'soleira', bloco:'encontros', nome:'Soleira',
    pergunta:'Há soleira no vão?',
    tipo:'opcao', recusa:'Sem soleira',
    opcoes:[
      { id:'sol-pedra',   nome:'Pedra',           desc:'Fornecida pela obra.',
        texto:'A soleira de pedra é de terceiro. O que precisa estar definido aqui é a largura e a cota do topo, para o assoalho chegar nela sem degrau.' },
      { id:'sol-madeira', nome:'Madeira Parket',  desc:'Mesma espécie do piso.',
        texto:'Soleira usinada na mesma madeira do assoalho, com o topo arredondado ou chanfrado. Continua a leitura do piso através do vão.' },
      { id:'sol-metal',   nome:'Perfil metálico', desc:'Linha fina, sem madeira.',
        texto:'Perfil embutido no vão, mais fino e mais duro que a soleira de madeira. Some no chão em vez de somar mais uma peça.' },
    ],
    campos:[
      { id:'largura', rotulo:'Largura', tipo:'medida', unidade:'mm', sugestoes:[100,150,200] },
      { id:'quem',    rotulo:'Fornece', tipo:'opcao-curta', valores:['Parket','Obra','A definir'] },
    ]},

  { id:'junta', bloco:'encontros', nome:'Junta de dilatação',
    pergunta:'Onde a madeira pode se mexer?',
    nota:'A madeira trabalha o ano inteiro. Sem folga, ela empena ou levanta — é a causa mais comum de patologia.',
    tipo:'opcao', obrigatorio:true,
    opcoes:[
      { id:'jd-perim', nome:'Só perimetral', desc:'Folga escondida sob o rodapé.',
        texto:'A folga corre no perímetro do ambiente e some sob o rodapé. Resolve ambientes de área e vão moderados, sem interrupção no meio do piso.' },
      { id:'jd-inter', nome:'Perimetral e intermediária', desc:'Mais uma junta no meio do vão.',
        texto:'Além do perímetro, uma junta atravessa o piso — em geral no vão de porta ou na mudança de ambiente. Necessária em área contínua grande e quando há aquecimento.' },
    ],
    campos:[
      { id:'folga', rotulo:'Folga perimetral', tipo:'medida', unidade:'mm', sugestoes:[10,12,15] },
    ]},

  /* ── recortes ──────────────────────────────────────────── */
  { id:'recortes', bloco:'recortes', ref:'3.2', nome:'Recortes',
    pergunta:'O que interrompe o piso neste ambiente?',
    tipo:'multi', recusa:'Sem recorte', aditivo:true, quantifica:true,
    opcoes:_deDetalhe('3.2').concat([
      { id:'3.2.3', nome:'Pilar',   desc:'Recorte fechado em volta da coluna.',
        texto:'A régua contorna o pilar. O acabamento pode ser recorte fechado, encostando na estrutura, ou com arremate — e essa escolha muda a usinagem peça a peça.' },
      { id:'3.2.4', nome:'Lareira', desc:'Afastamento e proteção obrigatórios.',
        texto:'O piso para antes da lareira, com o afastamento que a norma e o fabricante exigem, e o intervalo recebe material incombustível. É recorte e é distância — as duas coisas entram no desenho.' },
      { id:'3.2.5', nome:'Difusor de ar', desc:'Grelha de piso na paginação.',
        texto:'A grelha entra recortada na régua e, quando possível, revestida na mesma madeira, para sumir dentro do desenho do piso.' },
      { id:'3.2.6', nome:'Alçapão de inspeção', desc:'Tampa removível.',
        texto:'Tampa em assoalho sobre o ponto de inspeção, removível sem quebrar o desenho da paginação.' },
      { id:'3.2.7', nome:'Outro obstáculo', desc:'Descrever em observações.',
        texto:'Qualquer outro elemento que atravesse o piso. Descreva em observações técnicas: cada caso vira um detalhe desenhado à parte.' },
    ])},

  { id:'entretrilho', bloco:'recortes', ref:'3.3', nome:'Entretrilho',
    pergunta:'Há trilho embutido no contrapiso?',
    tipo:'sim-nao', opcoes:_deDetalhe('3.3') },

  /* ── acabamento ────────────────────────────────────────── */
  { id:'acabamento', bloco:'acabamento', nome:'Sistema de acabamento',
    pergunta:'Como a madeira é protegida?',
    nota:'Muda o prazo da obra, o cheiro durante a aplicação e como o piso é mantido depois.',
    tipo:'opcao', obrigatorio:true,
    opcoes:[
      { id:'ac-oleo',   nome:'Óleo', desc:'Toque de madeira crua; reparo localizado.',
        texto:'O óleo penetra na fibra em vez de formar película. O piso continua com cara e toque de madeira, risca menos à vista e permite reparo em ponto isolado, sem lixar o ambiente inteiro. Pede reaplicação periódica.' },
      { id:'ac-verniz', nome:'Verniz', desc:'Película protetora; manutenção rara.',
        texto:'O verniz forma película sobre a madeira. Protege mais contra líquido e desgaste e quase não pede manutenção — mas, quando risca, o reparo é do pano inteiro, não do ponto.' },
      { id:'ac-cera',   nome:'Cera', desc:'Acabamento mais fosco e mais sensível.',
        texto:'A cera dá o aspecto mais fosco e mais próximo da madeira sem tratamento. É o mais sensível a água e o que exige rotina de manutenção mais frequente.' },
    ],
    campos:[
      { id:'brilho', rotulo:'Brilho', tipo:'opcao-curta', valores:['Fosco','Acetinado','Semibrilho'] },
      { id:'onde',   rotulo:'Aplicação', tipo:'opcao-curta', valores:['Fábrica','Em obra'] },
    ]},

  /* ── notas ─────────────────────────────────────────────── */
  { id:'observacoes', bloco:'notas', nome:'Observações técnicas',
    pergunta:'Há algo específico deste ambiente?',
    nota:'Vai para o memorial descritivo junto com as escolhas acima.',
    tipo:'texto-longo',
    placeholder:'Mobiliário fixo que assenta sobre o piso, obstáculo fora do padrão, restrição de horário, o que a obra já executou…' },
];

/* ── regras ──────────────────────────────────────────────────
   Incompatibilidades e dependências, na forma que a tela lê.
   `quando` é uma função sobre as escolhas do ambiente; quando ela
   é verdadeira, `bloqueia` some da tela com o motivo escrito.
   Está aqui, e não no motor, porque é regra de engenharia — muda
   por decisão técnica, não por refatoração.
   ───────────────────────────────────────────────────────────── */
const REGRAS = [
  { id:'aquecido-elevado',
    quando:function(e){ return e.aquecido === '2.5' && e.elevado && e.elevado !== 'nao'; },
    bloqueia:'elevado',
    motivo:'Piso aquecido não convive com piso elevado: o vão de ar isola o calor e o sistema perde a função.' },

  { id:'aquecido-flutuante',
    quando:function(e){ return e.aquecido === '2.5' && e.instalacao === 'flutuante'; },
    bloqueia:'instalacao',
    motivo:'Com aquecimento, o colado é o indicado: a manta do flutuante atrapalha a troca de calor.' },

  { id:'aquecido-pregado',
    quando:function(e){ return e.aquecido === '2.5' && e.instalacao === 'pregado'; },
    bloqueia:'instalacao',
    motivo:'O pregado cria vão de ar sobre a tubulação e anula o aquecimento.' },

  { id:'flutuante-rodape-invertido',
    quando:function(e){ return e.instalacao === 'flutuante' && e.rodape === '3.1.1'; },
    bloqueia:'rodape',
    motivo:'O rodapé invertido não deixa folga perimetral, e o flutuante precisa dela para trabalhar.' },

  { id:'elevado-pregado',
    quando:function(e){ return e.instalacao === 'pregado' && e.elevado && e.elevado !== 'nao'; },
    bloqueia:'elevado',
    motivo:'O pregado já assenta sobre barrotes — somar piso elevado empilha duas estruturas com a mesma função.' },
];

/* Avisos: não bloqueiam, mas o cliente precisa ver antes de fechar. */
const AVISOS = [
  { quando:function(e){ return e.paginacao === '2.1.2' || e.paginacao === '2.1.5' || e.paginacao === '2.1.6'; },
    texto:'Esta paginação exige o desenho fechado antes do primeiro corte, e a perda de material é bem maior que na reta.' },
  { quando:function(e){ return e.rodape === '3.1.1'; },
    texto:'O rodapé invertido é embutido na alvenaria: precisa ser decidido antes do reboco. Depois dele, não há como executar.' },
  { quando:function(e){ return e.aquecido === '2.5'; },
    texto:'Com aquecimento, a espessura e a espécie da régua deixam de ser só estética: entram na conta térmica, e o protocolo de partida precisa ser combinado.' },
  { quando:function(e){ return e.junta === 'jd-perim' && e.aquecido === '2.5'; },
    texto:'Ambiente aquecido costuma exigir junta intermediária, e não só a perimetral.' },
];
