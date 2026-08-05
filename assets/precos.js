/* ─────────────────────────────────────────────────────────────
   Preço por detalhe — a única tabela a mexer quando os valores
   saírem. A chave é a numeração da LISTA BIBLIOTECA, a mesma de
   dados.js.

   null  = ainda não precificado. O item aparece como "a definir"
           e o total da página vira "sob consulta".
   0     = incluso, sem custo adicional.
   número= valor em reais.

   Enquanto houver um único null entre os itens escolhidos, a
   página não soma nada. É proposital: melhor não mostrar total
   nenhum do que mostrar um total que mente.
   ───────────────────────────────────────────────────────────── */
const PRECOS = {
  /* 2.1 Tipo de paginação, 2.2 sistema de instalação e 2.3 início
     de paginação saíram do índice do detalhamento — viraram texto,
     sem prancha. Ficam fora daqui até terem lugar próprio de preço:
     a base entra em toda obra e a paginação é escolhida na seção
     do alto da página, que ainda não alimenta o escopo. */

  /* 2.4 Piso elevado */
  '2.4.1': null,   // Com barrote
  '2.4.2': null,   // Com estrutura metálica

  /* 2.5 Piso aquecido */
  '2.5':   null,   // Tubulação aquecida

  /* 2.6 Transição de piso */
  '2.6.1': null,   // Baguete
  '2.6.2': null,   // Baguete em desnível
  '2.6.3': null,   // Perfil metálico
  '2.6.4': null,   // Perfil metálico em desnível

  /* 2.7 Alinhamento de transição */
  '2.7.1': null,   // No eixo da porta
  '2.7.2': null,   // Na face da porta
  '2.7.3': null,   // Na face, em desnível

  /* 3.1 Rodapé */
  '3.1.1': null,   // Invertido (metálico)
  '3.1.2': null,   // Cordão
  '3.1.3': null,   // Madeira personalizado

  /* 3.2 Recorte — tomada e ralo podem coexistir */
  '3.2.1': null,   // Tomada
  '3.2.2': null,   // Ralo

  /* 3.3 Entretrilho */
  '3.3':   null,   // Trilho oculto
};

/* Unidade de cobrança, quando existir. Aparece ao lado do valor
   ("R$ 180 /m²"). Deixe fora do mapa o que for preço fechado. */
/* A unidade também liga o campo de quantidade na tela: item COM
   unidade pede quanto, item SEM unidade só pede onde. Por isso o
   que está aqui embaixo é decisão de negócio, não formatação.

   Preenchi só o que é inequívoco na obra. O resto está listado
   abaixo, comentado, esperando você dizer como cobra. */
const PRECO_UNIDADE = {
  '3.1.1': 'm linear',    // rodapé: perímetro do ambiente
  '3.1.2': 'm linear',
  '3.1.3': 'm linear',
  '3.2.1': 'un',          // recorte: dá para contar tomada e ralo
  '3.2.2': 'un',

  /* A confirmar — cada um muda a conta:

     2.4.1-2.4.2 Piso elevado  saiu o m² da área levantada.
     2.5   Piso aquecido       saiu o m² da área servida.
                             Os três pedem só o ambiente até você
                             dizer como cobra.
     2.6.1-2.6.4 Transição   'un' (por soleira) ou 'm linear' (pela
                             largura do vão)? Peça é cortada na medida
                             da porta, mas o cliente conta portas.
     2.7.1-2.7.3 Alinhamento não parece item de cobrança: é a posição
                             da transição, não outra peça. Se for só
                             especificação, fica sem unidade e sem
                             preço — e a tela deixa de pedir quanto.
     3.3   Entretrilho       'm linear' pelo trilho ou 'un' por porta
                             de correr?
     Enquanto ficarem de fora, esses itens pedem só o ambiente. */
};

/* Vocabulário de unidade, para a tabela sair igual à da proposta:
     UNI = unidade · MTL = metro linear · M2 = metro quadrado
   Aqui gravamos por extenso porque o valor aparece ao lado do preço
   para o cliente final ("R$ 85 /m linear"), e sigla em orçamento de
   quem não é da obra atrapalha mais do que economiza.

   A unidade também decide a conta: preço por UNI é fixo por ambiente;
   por MTL e M2 depende de medida, que só existe depois da vistoria —
   nesses casos o total honesto continua sendo "sob consulta".

   A tabela de FORRO recebida em 04/08/2026 (sanca, bandô, alçapão,
   tabica, flap TV…) está em precos-forro.js. Nenhum daqueles itens é
   de piso, então não entra aqui. */
