/* ─────────────────────────────────────────────────────────────
   Fonte única de dados do site.

   As 11 páginas leem daqui: a home monta o catálogo a partir de
   SERVICOS, cada página de categoria lê o seu próprio item, e
   piso.html usa também PAGINACOES e DETALHES.

   Carregado como script clássico (sem type="module") de propósito:
   assim o site abre por file:// sem servidor.
   ───────────────────────────────────────────────────────────── */

const SERVICOS = [
  {
    nome:'Piso de Madeira', slug:'piso', resumo:'Do contrapiso ao rodapé: 24 pranchas técnicas e seis paginações desenhadas.', acervo:true, itens:37, subs:true,
    /* a capa do cartão é a sala das paginações, que é o produto —
       antes vinha da primeira etapa, e virava foto de demolição */
    capa:'piso/reta.webp',
    /* estas cinco não têm `img`: são desenhadas em secoes.js, pela
       mesma numeração. Ver o porquê no cabeçalho daquele arquivo. */
    etapas:[
      { num:'1.5', etapa:'Remoção de piso existente', curto:'Remoção', nota:'A base aparece', titulo:'O piso antigo sai por inteiro',
        texto:'O que fica é a base. É a partir dela que todo o resto é decidido.' },
      { num:'1.1', etapa:'Piso em contato com solo', curto:'Barreira', nota:'Umidade do solo', titulo:'O solo libera umidade o ano inteiro',
        texto:'Entre a terra e a madeira existem camadas. Cada uma interrompe uma parte desse caminho.' },
      { num:'1.3', etapa:'Impermeabilização', curto:'Impermeabilização', nota:'Barreira de vapor', titulo:'Uma camada contínua sela o contrapiso',
        texto:'É ela que separa a umidade da madeira. Não há segunda chance depois do piso instalado.' },
      { num:'1.2', etapa:'Autonivelante', curto:'Nivelamento', nota:'Plano perfeito', titulo:'Nenhum contrapiso é perfeitamente plano',
        texto:'A massa corre sozinha e corrige o que o olho não enxerga.' },
      { num:'1.4', etapa:'Endurecimento de contrapiso', curto:'Endurecimento', nota:'Poros selados', titulo:'O endurecedor fecha os poros do concreto',
        texto:'A base para de soltar pó e passa a segurar a cola.' },
      { num:'2.1', etapa:'Tipo de paginação', titulo:'A paginação é decidida antes da primeira régua',
        texto:'Reta, chevron, espinha de peixe ou tabeira. O desenho define o corte e o desperdício.',
        img:'assets/web/piso-6.webp', paginacao:true },
      { num:'3.1', etapa:'Rodapé e transições', titulo:'O encontro com a parede é o último detalhe',
        texto:'Rodapé invertido, cordão ou peça personalizada — e cada mudança de ambiente pede uma transição.',
        img:'assets/web/piso-7.webp' },
    ]
  },
  {
    nome:'Forro', slug:'forro', resumo:'Estrutura, tabica, sanca e cortineiro — o forro que esconde a própria instalação.', acervo:false, itens:77,
    etapas:[
      { num:'7.1', etapa:'Estrutura', titulo:'O forro começa preso na laje',
        texto:'Parafusada ou fincapino. A escolha muda o pé-direito final e o que pode ser pendurado depois.',
        img:'assets/web/forro-1.webp' },
      { num:'8.1', etapa:'Paginação', titulo:'A régua nasce de um ponto só',
        texto:'O início da paginação é definido em projeto para que as emendas caiam onde ninguém olha.',
        img:'assets/web/forro-2.webp' },
      { num:'8.5', etapa:'Tabica', titulo:'A tabica é a sombra que separa forro e parede',
        texto:'Simples, com painel passante ou em ripado. É o detalhe que faz o forro parecer flutuar.',
        img:'assets/web/forro-3.webp' },
      { num:'8.6', etapa:'Sanca iluminada', titulo:'A luz nasce dentro do forro',
        texto:'Régua, painel ou ripado sobre barrote ou laje. A fita de LED some e só a luz aparece.',
        img:'assets/web/forro-4.webp' },
      { num:'8.7', etapa:'Cortineiro', titulo:'A cortina desaparece dentro da madeira',
        texto:'O trilho fica embutido. O tecido cai do forro sem nenhuma ferragem à vista.',
        img:'assets/web/forro-5.webp' },
      { num:'10.1', etapa:'Grelha de ar-condicionado', titulo:'O ar sai sem quebrar o desenho',
        texto:'A grelha é revestida na mesma régua do forro e entra na paginação como se fosse parte dela.',
        img:'assets/web/forro-6.webp' },
    ]
  },
  {
    nome:'Marcenaria', slug:'marcenaria', resumo:'Medição, modulação e ferragem definidas antes de cortar a primeira chapa.', acervo:false, itens:34,
    etapas:[
      { num:'25.1', etapa:'Medição final e prumo', titulo:'A medição só vale com a obra pronta',
        texto:'Parede fora de prumo vira folga na porta. A conferência acontece antes de cortar qualquer chapa.',
        img:'assets/web/marcenaria-1.webp' },
      { num:'25.3', etapa:'Pontos elétricos e hidráulicos', titulo:'Cada ponto tem que existir antes do móvel',
        texto:'Tomada, rabicho de LED e ponto hidráulico posicionados em projeto — depois só há gambiarra.',
        img:'assets/web/marcenaria-2.webp' },
      { num:'26.2', etapa:'Modulação definida', titulo:'A modulação organiza tudo o que vem depois',
        texto:'Larguras, alturas e frentes decididas de uma vez. É o que garante o alinhamento entre módulos.',
        img:'assets/web/marcenaria-3.webp' },
      { num:'26.3', etapa:'Puxadores', titulo:'A mão encontra o móvel em um ponto escolhido',
        texto:'Perfil de alumínio, cava, fecho toque ou puxador sobreposto. Cada um pede uma folga diferente.',
        img:'assets/web/marcenaria-4.webp' },
      { num:'26.8', etapa:'Perfil LED', titulo:'A iluminação entra na estrutura, não em cima dela',
        texto:'Perfil embutido com sensor de presença. O móvel acende sem mostrar de onde vem a luz.',
        img:'assets/web/marcenaria-5.webp' },
    ]
  },
  {
    nome:'Portas', slug:'portas', resumo:'O movimento da folha decide o reforço, o trilho e a ferragem.', acervo:false, itens:32,
    etapas:[
      { num:'19.1', etapa:'Vão requadrado e batente', titulo:'O vão é corrigido antes da porta chegar',
        texto:'Requadro e batente metálico deixam a alvenaria pronta para receber a folha sem folga aparente.',
        img:'assets/web/portas-1.webp' },
      { num:'20.1', etapa:'Tipo de porta', titulo:'O movimento da porta muda o projeto inteiro',
        texto:'De correr, escamoteável, painel, camarão ou pivô. Cada tipo exige um reforço e um trilho próprios.',
        img:'assets/web/portas-2.webp' },
      { num:'20.2', etapa:'Material de revestimento', titulo:'A folha recebe o mesmo acabamento do ambiente',
        texto:'Madeira, laca, vidro ou espelho. O revestimento define o peso e, por consequência, a ferragem.',
        img:'assets/web/portas-3.webp' },
      { num:'20.4', etapa:'Ferragens', titulo:'A ferragem é escolhida pelo peso da folha',
        texto:'Fechadura padrão, eletrônica ou dobradiça invisível. É o que decide se a porta envelhece bem.',
        img:'assets/web/portas-4.webp' },
      { num:'20.5', etapa:'Puxador cava', titulo:'O puxador some dentro da própria folha',
        texto:'Quadrado, palito, contínuo ou cava horizontal — usinado na madeira, sem nada aplicado.',
        img:'assets/web/portas-5.webp' },
    ]
  },
  {
    nome:'Escada', slug:'escada', resumo:'Estrutura, revestimento e o topo da pisada — onde o olho pousa.', acervo:false, itens:27,
    etapas:[
      { num:'10.1', etapa:'Estrutura', titulo:'A escada bruta define o revestimento possível',
        texto:'Concreto ou metálica, com ou sem espera para o degrau. A medida bruta é conferida degrau a degrau.',
        img:'assets/web/escada-1.webp' },
      { num:'10.4', etapa:'Revestimento', titulo:'Lâmina, régua ou ripado',
        texto:'A escolha muda a espessura da pisada e o desenho do espelho — e não dá para trocar depois.',
        img:'assets/web/escada-2.webp' },
      { num:'11.2', etapa:'Topo da pisada', titulo:'O topo é onde o olho pousa',
        texto:'Topo em 45°, aparente ou passante. É o detalhe que separa uma escada bem-feita das outras.',
        img:'assets/web/escada-3.webp' },
      { num:'11.2.4', etapa:'Rebaixo LED', titulo:'A luz corre por baixo do degrau',
        texto:'Um rebaixo usinado esconde a fita e ilumina o degrau seguinte sem ofuscar quem sobe.',
        img:'assets/web/escada-4.webp' },
      { num:'11.4', etapa:'Corrimão', titulo:'A mão desliza sem encontrar emenda',
        texto:'Topo, rebaixado simples ou rebaixado com LED. O corrimão acompanha a curva sem quebrar.',
        img:'assets/web/escada-5.webp' },
    ]
  },
  {
    nome:'Painéis', slug:'paineis', resumo:'Prumo, reforço e o encontro com a tabica: o painel corrige o que a parede errou.', acervo:false, itens:25,
    etapas:[
      { num:'22.1', etapa:'Prumo da parede', titulo:'A parede quase nunca está no prumo',
        texto:'O painel corrige o que a alvenaria errou — mas só se a folga estiver prevista em projeto.',
        img:'assets/web/paineis-1.webp' },
      { num:'22.6', etapa:'Reforços e pontos elétricos', titulo:'O que vai pendurado precisa de reforço',
        texto:'TV, caixa de som e tomadas mimetizadas exigem reforço e ponto elétrico antes do fechamento.',
        img:'assets/web/paineis-2.webp' },
      { num:'23.1', etapa:'Tipo de painel', titulo:'Régua, lâmina, ripado ou toblerone',
        texto:'Cada perfil devolve a luz de um jeito. O ripado marca sombra; a lâmina apaga a emenda.',
        img:'assets/web/paineis-3.webp' },
      { num:'23.4', etapa:'Porta mimetizada', titulo:'A porta desaparece dentro do painel',
        texto:'Mesma paginação, mesma folga, sem batente aparente. Só quem sabe onde fica consegue achar.',
        img:'assets/web/paineis-4.webp' },
      { num:'23.5', etapa:'Encontro com a tabica', titulo:'O painel termina antes de tocar o forro',
        texto:'Entrando na tabica, faceando ou com rebaixo superior. É o encontro que revela o cuidado.',
        img:'assets/web/paineis-5.webp' },
    ]
  },
  {
    nome:'Deck', slug:'deck', resumo:'Estrutura ventilada, caimento e a borda, que é a parte que mais sofre.', acervo:false, itens:17,
    etapas:[
      { num:'4.1', etapa:'Estrutura', titulo:'O deck flutua sobre barrote ou alumínio',
        texto:'A estrutura garante caimento e ventilação por baixo. Sem ela, a madeira apodrece de dentro.',
        img:'assets/web/deck-1.webp' },
      { num:'5.1', etapa:'Sentido de paginação', titulo:'A régua acompanha o percurso',
        texto:'O sentido é definido pela circulação e pela luz — e determina onde ficam as emendas.',
        img:'assets/web/deck-2.webp' },
      { num:'5.4', etapa:'Deck elevado', titulo:'O desnível vira degrau ou vira rampa',
        texto:'Rebaixo de contrapiso, degrau em nível ou rampa. A decisão é tomada antes da estrutura subir.',
        img:'assets/web/deck-3.webp' },
      { num:'5.6', etapa:'Borda e testeira de piscina', titulo:'A borda é o detalhe que mais sofre',
        texto:'Testeira e acabamento de topo protegem a ponta da régua do contato direto com a água.',
        img:'assets/web/deck-4.webp' },
      { num:'6.1', etapa:'Alçapão e recortes', titulo:'O que precisa de manutenção precisa abrir',
        texto:'Alçapão, ralo e ponto de LED entram na paginação para sumir dentro do desenho.',
        img:'assets/web/deck-5.webp' },
    ]
  },
  {
    nome:'Floreira', slug:'floreira', resumo:'Estrutura, impermeabilização e drenagem, resolvidas junto com o paisagismo.', acervo:false, itens:6,
    etapas:[
      { num:'13.1', etapa:'Estrutura', titulo:'Concreto ou barrote sustentam a floreira',
        texto:'A madeira nunca carrega a terra sozinha. A estrutura decide quanto peso ela pode receber.',
        img:'assets/web/floreira-1.webp' },
      { num:'14.2', etapa:'Base', titulo:'A base é impermeabilizada antes de tudo',
        texto:'Entre a terra úmida e a madeira existe sempre uma barreira. É o que faz a floreira durar.',
        img:'assets/web/floreira-2.webp' },
      { num:'14.3', etapa:'Topo', titulo:'O topo recebe o acabamento final',
        texto:'É a face mais exposta ao sol e à água — e a que define a leitura da peça de longe.',
        img:'assets/web/floreira-3.webp' },
      { num:'15', etapa:'Recortes e drenagem', titulo:'A água precisa de um caminho de saída',
        texto:'Recortes de dreno e formato reto ou orgânico são resolvidos junto com o paisagismo.',
        img:'assets/web/floreira-4.webp' },
    ]
  },
  {
    nome:'Fachada', slug:'fachada', resumo:'Tarugo, paginação e o acabamento de topo que impede a água de entrar.', acervo:false, itens:6,
    etapas:[
      { num:'16.1', etapa:'Estrutura', titulo:'A fachada é fixada em tarugo',
        texto:'O tarugo afasta a madeira da alvenaria e cria a ventilação que impede o empenamento.',
        img:'assets/web/fachada-1.webp' },
      { num:'17.1', etapa:'Tipo de paginação', titulo:'Peça única ou paginação aleatória',
        texto:'A peça única exige comprimento e seleção; a aleatória distribui as emendas pelo desenho.',
        img:'assets/web/fachada-2.webp' },
      { num:'17.1.2', etapa:'Paginação aleatória', titulo:'A sombra faz parte do projeto',
        texto:'O relevo entre réguas muda a fachada ao longo do dia. É desenhado, não é consequência.',
        img:'assets/web/fachada-3.webp' },
      { num:'18.1', etapa:'Acabamento de topo', titulo:'O topo é protegido por perfil metálico',
        texto:'É a ponta mais vulnerável da fachada. O perfil impede que a água entre pela cabeça da régua.',
        img:'assets/web/fachada-4.webp' },
    ]
  },
];

/* Sub-opções de 2.1 — o catálogo de piso, em biblioteca/piso.

   Regra do acervo: toda paginação é fotografada no MESMO ambiente,
   do mesmo ponto, com a mesma luz. Só o chão muda de uma para a
   outra. É isso que deixa a comparação honesta — o cliente vê a
   diferença da paginação, não a diferença da foto.

   A sala vem sempre de PISO_BASE; a foto da paginação entra por
   cima recortada em --piso-recorte, de modo que a troca não mexe
   em teto, caixilho nem vista.

   `ang` é a direção em que o estilo novo é assentado sobre o
   antigo: segue o sentido da própria paginação.

   Falta a foto de 2.1.2 Chevron — o desenho técnico dela está em
   dxf-png/. Basta fotografar no mesmo enquadramento, salvar em
   piso/ e acrescentar a linha aqui: nada mais precisa mudar. */
const PISO_BASE = 'piso/reta.webp';   // a sala; o chão dela é a Reta

const PAGINACOES = [
  { num:'2.1.1', nome:'Reta', img:'piso/reta.webp', ang:'0deg',
    titulo:'A régua corre num sentido só',
    texto:'É a paginação que menos desperdiça — e a que mais depende de um bom ponto de início.' },
  { num:'2.1.3', nome:'Espinha de peixe', img:'piso/espinha-de-peixe.jpg', ang:'135deg',
    titulo:'O desenho nasce do encaixe, não do corte',
    texto:'As réguas continuam retas e se encostam a 90°. O padrão vem da posição, não da usinagem.' },
  { num:'2.1.4', nome:'Tabeira', img:'piso/tabeira.jpg', radial:true,
    titulo:'Uma moldura contorna o ambiente',
    texto:'O campo corre por dentro e a tabeira fecha o perímetro. Ela é sempre a última a ser assentada.' },
  { num:'2.1.5', nome:'Versailles', img:'piso/versailles.jpg', radial:true,
    titulo:'O painel se repete como um módulo',
    texto:'Cada quadro é montado antes de descer ao contrapiso. A paginação parte do centro do ambiente.' },
  { num:'2.1.6', nome:'Wood + marble', img:'piso/wood-marble.jpg', ang:'45deg',
    titulo:'O mármore entra como parte da paginação',
    texto:'A pedra é embutida na própria régua. Exige usinagem por peça e paginação fechada antes do corte.' },
];

/* ─────────────────────────────────────────────────────────────
   Detalhamento — os 16 desenhos que viram escolha na página.

   O acervo do pacote tem 24 pranchas. Três assuntos saíram desta
   lista de propósito, porque são decisão de planta e não de corte,
   e já estão resolvidos antes: o tipo de paginação (seção própria,
   no alto da página), o sistema de instalação (é a própria seção
   que a pilha desenha, e por isso virou o texto de abertura) e o
   início de paginação. Os três continuam no texto de piso.html —
   sem desenho. As pranchas deles seguem em assets/tec/.

   A numeração é a da LISTA BIBLIOTECA; os desenhos são os DXF de
   obra exportados. `camada` diz em que altura da seção o detalhe
   age, e é o que a pilha ao lado acende:

     assoalho  → mexe na própria régua
     entre     → insere algo entre o contrapiso e o assoalho
     encontro  → resolve a borda, onde o piso topa com outra coisa

   `muda` é a frase curta do que separa uma variante da irmã — é
   o que faz a comparação valer, já que o resto do desenho é igual.
   ───────────────────────────────────────────────────────────── */
const DETALHES = [
  { num:'2.4', nome:'Piso elevado', camada:'entre',
    nota:'Entra uma estrutura entre o contrapiso e o assoalho.',
    itens:[
      { num:'2.4.1', nome:'Com barrote', img:'elevado-barrote',
        titulo:'O barrote levanta o piso numa altura fixa',
        texto:'Barrote de 4,5 × 2,5 cm entre o contrapiso e o assoalho, servindo de fixação para os painéis. Ganha altura constante e abre o vão para passagem de instalação.',
        muda:'Altura fixa, definida pelo barrote.' },
      { num:'2.4.2', nome:'Com estrutura metálica', img:'elevado-metalica',
        titulo:'O suporte telescópico regula ponto a ponto',
        texto:'Cada apoio é ajustável em altura. Resolve desnível grande e contrapiso fora de nível sem depender da regularização — o acerto é feito no próprio suporte.',
        muda:'Altura regulável em cada apoio.' },
    ]},

  { num:'2.5', nome:'Piso aquecido', camada:'entre',
    nota:'A tubulação ocupa a faixa entre o contrapiso e a cola.',
    itens:[
      { num:'2.5', nome:'Tubulação aquecida', img:'aquecido',
        titulo:'O calor sobe por contato, através da régua',
        texto:'A tubulação corre em manta ou dentro do próprio contrapiso, logo abaixo da cola. Como o calor atravessa a madeira, espessura e espécie deixam de ser só estética e entram na conta térmica.' },
    ]},

  { num:'2.6', nome:'Transição de piso', camada:'encontro',
    nota:'A borda onde o assoalho topa com o piso frio.',
    itens:[
      { num:'2.6.1', nome:'Baguete', img:'transicao-baguete',
        titulo:'A baguete de madeira fecha a junta',
        texto:'Os dois pisos chegam no mesmo nível e a baguete arremata o encontro sob a folha da porta. A madeira continua a leitura do assoalho.',
        muda:'Baguete de madeira · em nível.' },
      { num:'2.6.2', nome:'Baguete em desnível', img:'transicao-baguete-desnivel',
        titulo:'Quando os pisos não chegam na mesma altura',
        texto:'O piso frio fica abaixo do assoalho e a baguete vira também o arremate do degrau. É a solução quando o rebaixo de contrapiso não foi previsto.',
        muda:'Baguete de madeira · em desnível.' },
      { num:'2.6.3', nome:'Perfil metálico', img:'transicao-perfil',
        titulo:'O perfil metálico faz a junta desaparecer',
        texto:'Mesma condição em nível, com um perfil no lugar da baguete. A linha fica mais fina e mais dura — some no chão em vez de somar mais uma madeira.',
        muda:'Perfil metálico · em nível.' },
      { num:'2.6.4', nome:'Perfil metálico em desnível', img:'transicao-perfil-desnivel',
        titulo:'O perfil resolve também o degrau',
        texto:'O perfil fecha a diferença de altura entre o assoalho e o piso frio, protegendo o topo da régua, que é a parte mais vulnerável do encontro.',
        muda:'Perfil metálico · em desnível.' },
    ]},

  { num:'2.7', nome:'Alinhamento de transição', camada:'encontro',
    nota:'Mesma junta, três posições em relação à porta.',
    itens:[
      { num:'2.7.1', nome:'No eixo da porta', img:'alinhamento-eixo',
        titulo:'A junta fica escondida sob a folha',
        texto:'A baguete cai no eixo da porta. Com a porta fechada, não se vê nem de um lado nem do outro — é o alinhamento que some.',
        muda:'Junta no eixo da folha.' },
      { num:'2.7.2', nome:'Na face da porta', img:'alinhamento-face',
        titulo:'A junta acompanha a face do batente',
        texto:'A baguete recua para a face da porta. Aparece de um lado e some do outro — escolha-se de que ambiente o piso deve parecer contínuo.',
        muda:'Junta na face do batente.' },
      { num:'2.7.3', nome:'Na face, em desnível', img:'alinhamento-face-desnivel',
        titulo:'A face do batente com diferença de altura',
        texto:'Mesma posição na face, com o piso frio abaixo do assoalho. A baguete acumula as duas funções: fecha a junta e arremata o degrau.',
        muda:'Junta na face · em desnível.' },
    ]},

  { num:'3.1', nome:'Rodapé', camada:'encontro',
    nota:'O encontro do piso com a parede.',
    itens:[
      { num:'3.1.1', nome:'Invertido (metálico)', img:'rodape-invertido',
        titulo:'A parede desce até o piso',
        texto:'O perfil metálico é embutido na alvenaria e o assoalho encosta nele. Não há rodapé para ver: a parede chega ao chão numa linha só.',
        muda:'Perfil embutido na parede.' },
      { num:'3.1.2', nome:'Cordão', img:'rodape-cordao',
        titulo:'Uma seção mínima encosta na parede',
        texto:'Rodapé Parket de seção reduzida, apoiado sobre o assoalho. Resolve a folga de dilatação com o mínimo de presença.',
        muda:'Seção reduzida, sobreposta.' },
      { num:'3.1.3', nome:'Madeira personalizado', img:'rodape-madeira',
        titulo:'A seção é desenhada para o projeto',
        texto:'Altura e perfil entram como cota no desenho. É o caminho quando o rodapé precisa conversar com a marcenaria e com o painel, não só com o piso.',
        muda:'Altura definida em projeto.' },
    ]},

  { num:'3.2', nome:'Recorte', camada:'assoalho',
    nota:'Aberturas feitas no próprio assoalho.',
    itens:[
      { num:'3.2.1', nome:'Tomada', img:'recorte-tomada',
        titulo:'A tomada de piso some quando não está em uso',
        texto:'Perfil metálico em L e caixa fornecidos pela obra; a tampa é de assoalho chanfrado e sai inteira. Fechada, ela devolve o desenho da paginação.',
        muda:'Tampa em assoalho chanfrado.' },
      { num:'3.2.2', nome:'Ralo', img:'recorte-ralo',
        titulo:'O acesso continua, o desenho não quebra',
        texto:'Tampa removível em assoalho sobre o ralo. A manutenção segue possível sem que o piso ganhe uma peça estranha no meio.',
        muda:'Tampa removível sobre o ralo.' },
    ]},

  { num:'3.3', nome:'Entretrilho', camada:'encontro',
    nota:'O vão dos trilhos embutidos.',
    itens:[
      { num:'3.3', nome:'Trilho oculto', img:'entretrilho',
        titulo:'O piso corre por baixo das portas',
        texto:'Peças entre-trilho preenchem os vãos entre os trilhos embutidos no contrapiso. Com as portas abertas, o assoalho atravessa o vão sem interrupção.' },
    ]},
];
