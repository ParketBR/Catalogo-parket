/* ─────────────────────────────────────────────────────────────
   Módulo de Definição Técnica — a tela onde o cliente define,
   ambiente por ambiente, o que a obra vai executar.

   ── o que este arquivo é e o que não é ───────────────────────
   É só a camada de escolha: os ambientes vêm de ambientes.js
   (contrato de exemplo), as opções vêm de DETALHES em dados.js —
   as mesmas 16 pranchas do catálogo, sem cópia — e o que o
   cliente marca fica em localStorage.

   NÃO fala com banco de dados, não gera PDF, não emite aditivo.
   Onde o sistema de verdade gravaria ou emitiria, aqui a tela
   mostra na hora e diz o que ficaria registrado. Foi pedido
   assim: primeiro a experiência, banco depois.

   ── as três ideias que sustentam a tela ──────────────────────
   1. O ambiente é a unidade. Toda escolha mora nele. Nada é
      global: piso aquecido pode ser sim na suíte e não no quarto.
   2. Um assunto de cada vez. Em vez da lista inteira, blocos —
      Piso, Deck, Escada — e dentro do bloco uma definição por vez.
   3. Transição é lista, não campo. Um ambiente encosta em vários
      outros, e cada encontro tem a sua própria solução. Este foi
      o ponto mais insistido na reunião e é o que mais muda a
      estrutura de dados: `transicoes` é array, o resto é escalar.
   ───────────────────────────────────────────────────────────── */
(function(){
  'use strict';
  var raiz = document.getElementById('definicao');
  if (!raiz || typeof CONTRATO === 'undefined' || typeof DETALHES === 'undefined') return;

  var CHAVE = 'parket:definicao:' + CONTRATO.cliente;

  /* ── o que cada bloco pergunta ─────────────────────────────
     `ref` aponta para o grupo em DETALHES: o texto, a prancha e a
     numeração da LISTA BIBLIOTECA saem de lá. Aqui fica só o que
     é próprio da tela — como se pergunta, e se custa a mais.

     tipo:
       opcao      escolhe uma; `recusa` cria a alternativa "sem"
       multi      convivem (tomada e ralo no mesmo ambiente)
       sim-nao    grupo de item único vira pergunta fechada
       transicoes o repetidor: N encontros, cada um com solução
     aditivo: entra como serviço adicional no contrato.          */
  var BLOCOS = {
    piso: {
      nome:'Piso',
      itens:[
        { ref:'2.4', tipo:'opcao',  recusa:'Sem piso elevado', aditivo:true,
          pergunta:'O piso sobe da laje?' },
        { ref:'2.5', tipo:'sim-nao', aditivo:true,
          pergunta:'Vai ter piso aquecido?' },
        { ref:'3.1', tipo:'opcao', obrigatorio:true,
          pergunta:'Como o piso encontra a parede?' },
        { ref:'3.2', tipo:'multi', recusa:'Sem recorte', aditivo:true,
          pergunta:'Tem algum recorte no meio do piso?' },
        { ref:'3.3', tipo:'sim-nao',
          pergunta:'Há trilho embutido no contrapiso?' },
        { tipo:'transicoes', refTipo:'2.6', refAlinha:'2.7',
          pergunta:'Com quais ambientes este encosta?' },
      ],
    },
    deck:   { nome:'Deck',   pendente:'O acervo técnico de deck ainda não foi desenhado. As definições entram aqui quando os DXF forem exportados.' },
    escada: { nome:'Escada', pendente:'O acervo técnico de escada ainda não foi desenhado. As definições entram aqui quando os DXF forem exportados.' },
  };

  var grupo = {};
  DETALHES.forEach(function(g){ grupo[g.num] = g; });

  var BRL = new Intl.NumberFormat('pt-BR', {
    style:'currency', currency:'BRL', maximumFractionDigits:0 });

  function preco(num){
    return (typeof PRECOS !== 'undefined' && num in PRECOS) ? PRECOS[num] : null;
  }
  function rotulaPreco(num){
    var v = preco(num);
    if (v === null || v === undefined) return { txt:'a definir', vago:true };
    if (v === 0) return { txt:'incluso', vago:false };
    return { txt:BRL.format(v), vago:false };
  }

  /* ── estado ────────────────────────────────────────────────
     Por ambiente: { itens:{ ref: {on, vars[]} }, transicoes:[] }
     Só o que o cliente decidiu; o resto se deduz de BLOCOS.     */
  var estado = {};
  CONTRATO.ambientes.forEach(function(a){
    estado[a.num] = { itens:{}, transicoes:[] };
  });
  try {
    var salvo = JSON.parse(localStorage.getItem(CHAVE) || 'null');
    if (salvo) CONTRATO.ambientes.forEach(function(a){
      if (salvo[a.num]) estado[a.num] = {
        itens: salvo[a.num].itens || {},
        transicoes: salvo[a.num].transicoes || [],
      };
    });
  } catch (e) { /* storage bloqueado: começa limpo */ }

  function grava(){
    try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) {}
  }

  var ambienteAtual = CONTRATO.ambientes[0].num;
  var blocoAtual = null;

  function ambiente(num){
    return CONTRATO.ambientes.filter(function(a){ return a.num === num; })[0];
  }
  function itensDoBloco(id){
    var b = BLOCOS[id];
    return (b && b.itens) || [];
  }
  /* uma definição está resolvida quando o cliente encostou nela:
     escolheu, recusou, ou (transições) declarou que não há */
  function resolvida(amb, item){
    var s = estado[amb.num];
    if (item.tipo === 'transicoes') return s.transicoes.length > 0 || s.semTransicao;
    var e = s.itens[item.ref];
    return !!e && (e.on === true || e.on === false);
  }
  function progresso(amb){
    var total = 0, feitos = 0;
    amb.blocos.forEach(function(id){
      itensDoBloco(id).forEach(function(it){
        total++; if (resolvida(amb, it)) feitos++;
      });
    });
    return { total:total, feitos:feitos };
  }

  /* ── o que foi escolhido, em forma de lista ────────────────
     É a base do resumo, do relatório e dos aditivos: uma função
     só, para as três saídas nunca discordarem entre si.        */
  function escolhas(amb){
    var s = estado[amb.num], out = [];
    amb.blocos.forEach(function(id){
      itensDoBloco(id).forEach(function(item){
        if (item.tipo === 'transicoes') {
          s.transicoes.forEach(function(t){
            var gt = grupo[item.refTipo], ga = grupo[item.refAlinha];
            var vt = gt && gt.itens[t.tipo], va = ga && ga.itens[t.alinha];
            out.push({
              bloco:BLOCOS[id].nome, definicao:'Transição', aditivo:false,
              rotulo:'Encontro com ' + t.para,
              valor:[vt && vt.nome, va && va.nome].filter(Boolean).join(' · ') || 'a definir',
              num:vt ? vt.num : '2.6', img:vt && vt.img,
            });
          });
          return;
        }
        var e = s.itens[item.ref];
        if (!e) return;
        var g = grupo[item.ref];
        if (e.on === false) {
          out.push({ bloco:BLOCOS[id].nome, definicao:g.nome, aditivo:false,
                     rotulo:g.nome, valor:item.recusa || 'Não', num:null, recusado:true });
          return;
        }
        (e.vars || []).forEach(function(k){
          var it = g.itens[k];
          if (!it) return;
          out.push({ bloco:BLOCOS[id].nome, definicao:g.nome, aditivo:!!item.aditivo,
                     rotulo:g.nome, valor:it.nome, num:it.num, img:it.img });
        });
      });
    });
    return out;
  }
  function aditivos(amb){
    return escolhas(amb).filter(function(e){ return e.aditivo && !e.recusado; });
  }

  /* ── esqueleto ─────────────────────────────────────────────── */
  raiz.innerHTML =
    '<div class="def-grade">' +
      '<aside class="def-ambientes" aria-label="Ambientes do contrato">' +
        '<div class="def-obra">' +
          '<p class="kicker">Contrato</p>' +
          '<h2>' + CONTRATO.obra + '</h2>' +
          '<p class="def-obra-nota">' + CONTRATO.cliente + ' · ' +
            CONTRATO.ambientes.length + ' ambientes</p>' +
        '</div>' +
        '<ol class="def-lista" id="def-lista"></ol>' +
      '</aside>' +
      '<div class="def-painel" id="def-painel"></div>' +
    '</div>' +
    '<div class="lupa" id="lupa" hidden role="dialog" aria-modal="true" aria-label="Detalhe da opção">' +
      '<div class="lupa-caixa" id="lupa-caixa"></div>' +
    '</div>';

  var elLista = document.getElementById('def-lista');
  var elPainel = document.getElementById('def-painel');
  var elLupa = document.getElementById('lupa');
  var elLupaCaixa = document.getElementById('lupa-caixa');

  function pintaLista(){
    elLista.innerHTML = CONTRATO.ambientes.map(function(a){
      var p = progresso(a);
      var pronto = p.total > 0 && p.feitos === p.total;
      return '<li><button class="def-amb" type="button" data-amb="' + a.num + '"' +
        ' aria-pressed="' + (a.num === ambienteAtual) + '">' +
        '<span class="def-amb-num">' + a.num + '</span>' +
        '<span class="def-amb-corpo">' +
          '<span class="def-amb-nome">' + a.nome + '</span>' +
          '<span class="def-amb-meta">' + a.produto + ' · ' + a.area + ' m²</span>' +
        '</span>' +
        '<span class="def-amb-passo' + (pronto ? ' pronto' : '') + '">' +
          (p.total ? p.feitos + '/' + p.total : '—') + '</span>' +
      '</button></li>';
    }).join('');
  }

  /* ── painel do ambiente ────────────────────────────────────── */
  function pintaPainel(){
    var amb = ambiente(ambienteAtual);
    if (!blocoAtual || amb.blocos.indexOf(blocoAtual) < 0) blocoAtual = amb.blocos[0];
    var bloco = BLOCOS[blocoAtual];

    var abas = amb.blocos.map(function(id){
      return '<button class="def-aba" type="button" data-bloco="' + id + '"' +
        ' aria-pressed="' + (id === blocoAtual) + '">' + BLOCOS[id].nome + '</button>';
    }).join('');

    var corpo;
    if (bloco.pendente) {
      corpo = '<p class="def-pendente">' + bloco.pendente + '</p>';
    } else {
      corpo = bloco.itens.map(function(item, i){
        return item.tipo === 'transicoes' ? cartaoTransicoes(amb, item, i)
                                          : cartaoItem(amb, item, i);
      }).join('');
    }

    elPainel.innerHTML =
      '<header class="def-cab">' +
        '<p class="kicker">Ambiente ' + amb.num + '</p>' +
        '<h2>' + amb.nome + '</h2>' +
        '<p class="def-cab-meta">' + amb.produto + ' · ' + amb.area + ' m²</p>' +
        '<div class="def-abas" role="group" aria-label="Assuntos">' + abas + '</div>' +
      '</header>' +
      '<div class="def-itens">' + corpo + '</div>' +
      resumo(amb);
  }

  /* uma definição = pergunta + opções em cartão. A opção "sem" é
     um cartão como os outros: recusar é uma decisão, e precisa
     ficar registrada como tal, não como campo em branco. */
  function cartaoItem(amb, item, i){
    var g = grupo[item.ref];
    if (!g) return '';
    var e = estado[amb.num].itens[item.ref] || {};
    var simNao = item.tipo === 'sim-nao';
    var opcoes = '';

    if (item.recusa || simNao) {
      opcoes += opcao({
        chave:'nao', nome: item.recusa || 'Não',
        desc: simNao ? 'Este ambiente não recebe ' + g.nome.toLowerCase() + '.'
                     : 'Nada é acrescentado à seção.',
        escolhida: e.on === false, img:null, aditivo:false,
      });
    }
    g.itens.forEach(function(it, k){
      opcoes += opcao({
        chave:String(k), nome: simNao ? 'Sim, ' + it.nome.toLowerCase() : it.nome,
        desc: it.muda || it.titulo, img: it.img, num: it.num,
        escolhida: e.on === true && (e.vars || []).indexOf(k) > -1,
        aditivo: !!item.aditivo,
      });
    });

    var faltando = !resolvida(amb, item);
    return '<section class="def-item' + (faltando ? ' aberta' : '') + '" data-ref="' + item.ref + '"' +
      ' data-tipo="' + item.tipo + '">' +
      '<div class="def-item-cab">' +
        '<span class="def-ord">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<div>' +
          '<h3>' + item.pergunta + '</h3>' +
          '<p class="def-item-nota">' + g.nome + ' · ' + g.nota + '</p>' +
        '</div>' +
        '<span class="def-estado' + (faltando ? '' : ' ok') + '">' +
          (faltando ? 'a definir' : 'definido') + '</span>' +
      '</div>' +
      '<div class="def-opcoes">' + opcoes + '</div>' +
    '</section>';
  }

  function opcao(o){
    var arte = o.img
      ? '<img src="assets/tec/' + o.img + '.webp" alt="" loading="lazy" decoding="async">'
      : '<span class="def-sem-arte">sem<br>desenho</span>';
    return '<div class="def-op' + (o.escolhida ? ' on' : '') + '" data-op="' + o.chave + '">' +
      '<button class="def-op-arte" type="button" data-lupa="' + (o.num || '') + '"' +
        ' aria-label="Ampliar ' + o.nome + '">' + arte + '</button>' +
      '<div class="def-op-txt">' +
        '<span class="def-op-nome">' + o.nome + '</span>' +
        '<span class="def-op-desc">' + (o.desc || '') + '</span>' +
        (o.aditivo && o.chave !== 'nao'
          ? '<span class="def-aditivo">Aditivo · ' + rotulaPreco(o.num).txt + '</span>' : '') +
      '</div>' +
      '<button class="def-op-sel" type="button" data-sel="' + o.chave + '">' +
        (o.escolhida ? 'Selecionado' : 'Selecionar') + '</button>' +
    '</div>';
  }

  /* ── transições ────────────────────────────────────────────
     O repetidor. Cada linha é um encontro: para onde, com que
     peça e em que posição em relação à porta. */
  function cartaoTransicoes(amb, item, i){
    var s = estado[amb.num];
    var gt = grupo[item.refTipo], ga = grupo[item.refAlinha];
    var destinos = CONTRATO.ambientes
      .filter(function(a){ return a.num !== amb.num; })
      .map(function(a){ return a.nome; })
      .concat(DESTINOS_EXTERNOS);

    var linhas = s.transicoes.map(function(t, k){
      return '<div class="def-tr" data-tr="' + k + '">' +
        '<div class="def-tr-topo">' +
          '<span class="def-tr-ord">' + amb.nome + ' → </span>' +
          '<select class="def-tr-para" data-tr-para="' + k + '" aria-label="Ambiente vizinho">' +
            destinos.map(function(d){
              return '<option' + (d === t.para ? ' selected' : '') + '>' + d + '</option>';
            }).join('') +
          '</select>' +
          '<button class="def-tr-x" type="button" data-tr-rem="' + k + '"' +
            ' aria-label="Remover transição">remover</button>' +
        '</div>' +
        '<div class="def-tr-escolhas">' +
          campoTransicao('Peça', gt, t.tipo, 'tr-tipo', k) +
          campoTransicao('Posição', ga, t.alinha, 'tr-alinha', k) +
        '</div>' +
      '</div>';
    }).join('');

    var faltando = !resolvida(amb, item);
    return '<section class="def-item def-item-tr' + (faltando ? ' aberta' : '') + '">' +
      '<div class="def-item-cab">' +
        '<span class="def-ord">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<div>' +
          '<h3>' + item.pergunta + '</h3>' +
          '<p class="def-item-nota">Cada encontro tem a sua própria solução — um ambiente pode ter várias.</p>' +
        '</div>' +
        '<span class="def-estado' + (faltando ? '' : ' ok') + '">' +
          (faltando ? 'a definir' : s.transicoes.length + ' transições') + '</span>' +
      '</div>' +
      '<div class="def-trs">' + linhas + '</div>' +
      '<div class="def-tr-acoes">' +
        '<button class="def-mais" type="button" id="tr-add">+ Acrescentar transição</button>' +
        (s.transicoes.length ? '' :
          '<button class="def-nenhuma' + (s.semTransicao ? ' on' : '') + '" type="button" id="tr-nenhuma">' +
          'Este ambiente não encosta em outro piso</button>') +
      '</div>' +
    '</section>';
  }

  function campoTransicao(rotulo, g, escolhido, papel, k){
    if (!g) return '';
    return '<div class="def-tr-campo">' +
      '<span class="def-tr-rot">' + rotulo + '</span>' +
      '<div class="def-tr-ops">' +
        g.itens.map(function(it, j){
          return '<button class="def-tr-op' + (String(j) === String(escolhido) ? ' on' : '') + '"' +
            ' type="button" data-' + papel + '="' + k + '" data-v="' + j + '"' +
            ' title="' + it.titulo + '">' +
            '<img src="assets/tec/' + it.img + '.webp" alt="" loading="lazy" decoding="async">' +
            '<span>' + it.nome + '</span>' +
          '</button>';
        }).join('') +
      '</div>' +
    '</div>';
  }

  /* ── resumo do ambiente ────────────────────────────────────
     O que o sistema levaria adiante. Enquanto não há banco, a
     tela mostra exatamente o que gravaria — e diz isso. */
  function resumo(amb){
    var lista = escolhas(amb), extras = aditivos(amb);
    var p = progresso(amb);

    var linhas = lista.length
      ? lista.map(function(e){
          return '<li>' +
            '<span class="def-r-def">' + (e.rotulo || e.definicao) + '</span>' +
            '<span class="def-r-val' + (e.recusado ? ' recusado' : '') + '">' + e.valor + '</span>' +
            '<span class="def-r-num">' + (e.num || '—') + '</span>' +
          '</li>';
        }).join('')
      : '<li class="def-r-vazio">Nada definido neste ambiente ainda.</li>';

    var blocoExtras = extras.length
      ? '<div class="def-extras">' +
          '<p class="def-extras-tit">Gera aditivo de contrato</p>' +
          '<ul>' + extras.map(function(e){
            var pr = rotulaPreco(e.num);
            return '<li><span>' + e.valor + '</span>' +
                   '<span class="' + (pr.vago ? 'vago' : '') + '">' + pr.txt + '</span></li>';
          }).join('') + '</ul>' +
          '<p class="def-extras-nota">Estes itens são serviço adicional. O valor fechado entra no aditivo, ' +
          'que a Parket emite junto com o pré-projeto.</p>' +
        '</div>'
      : '';

    return '<aside class="def-resumo" aria-live="polite">' +
      '<div class="def-resumo-cab">' +
        '<h3>O que vai para o projeto</h3>' +
        '<span>' + p.feitos + ' de ' + p.total + '</span>' +
      '</div>' +
      '<ul class="def-r-lista">' + linhas + '</ul>' +
      blocoExtras +
      '<button class="def-gerar" type="button" id="def-gerar"' +
        (p.total && p.feitos === p.total ? '' : ' disabled') + '>' +
        'Ver relatório técnico do ambiente</button>' +
      '<p class="def-nota-banco">Nesta versão nada é gravado em servidor: as escolhas ficam ' +
      'neste navegador. A integração com o banco e a emissão do projeto executivo são a etapa seguinte.</p>' +
    '</aside>';
  }

  function pinta(){ pintaLista(); pintaPainel(); grava(); }

  /* ── lupa ──────────────────────────────────────────────────
     Amplia a prancha e mostra o texto inteiro do detalhe. O slot
     de foto de obra existe e fica declarado como vazio: é melhor
     dizer que não há foto do que pôr banco de imagem no lugar. */
  function abreLupa(num){
    var achado = null;
    DETALHES.forEach(function(g){
      g.itens.forEach(function(it){ if (it.num === num) achado = { g:g, it:it }; });
    });
    if (!achado) return;
    var it = achado.it;
    elLupaCaixa.innerHTML =
      '<button class="lupa-x" type="button" id="lupa-x" aria-label="Fechar">fechar</button>' +
      '<figure class="lupa-arte"><img src="assets/tec/' + it.img + '.webp" alt="' +
        it.num + ' ' + it.nome + '"></figure>' +
      '<div class="lupa-txt">' +
        '<p class="kicker">' + achado.g.nome + ' · ' + it.num + '</p>' +
        '<h3>' + it.titulo + '</h3>' +
        '<p>' + it.texto + '</p>' +
        (it.muda ? '<p class="lupa-muda"><b>O que muda</b>' + it.muda + '</p>' : '') +
        '<p class="lupa-foto">Foto de obra: ainda não registrada para este detalhe. ' +
        'O desenho acima é a prancha executiva, exportada do DXF da obra.</p>' +
      '</div>';
    elLupa.hidden = false;
    document.body.classList.add('travado');
    var x = document.getElementById('lupa-x'); if (x) x.focus();
  }
  function fechaLupa(){
    elLupa.hidden = true;
    document.body.classList.remove('travado');
  }

  /* ── relatório ─────────────────────────────────────────────
     A saída por ambiente. Sai na própria tela e é imprimível —
     no sistema de verdade, é este conteúdo que alimenta o
     memorial e o projeto executivo. */
  function relatorio(amb){
    var lista = escolhas(amb), extras = aditivos(amb);
    elLupaCaixa.innerHTML =
      '<button class="lupa-x" type="button" id="lupa-x" aria-label="Fechar">fechar</button>' +
      '<div class="rel">' +
        '<p class="kicker">Relatório técnico</p>' +
        '<h3>' + amb.num + ' · ' + amb.nome + '</h3>' +
        '<p class="rel-meta">' + CONTRATO.obra + ' · ' + CONTRATO.cliente + '<br>' +
          amb.produto + ' · ' + amb.area + ' m² · ' +
          new Date().toLocaleDateString('pt-BR') + '</p>' +
        '<table class="rel-tab"><thead><tr>' +
          '<th>Definição</th><th>Escolha</th><th>Item</th></tr></thead><tbody>' +
          lista.map(function(e){
            return '<tr><td>' + (e.rotulo || e.definicao) + '</td>' +
                   '<td>' + e.valor + '</td><td>' + (e.num || '—') + '</td></tr>';
          }).join('') +
        '</tbody></table>' +
        (extras.length
          ? '<p class="rel-tit">Aditivos</p><ul class="rel-ad">' +
            extras.map(function(e){
              return '<li>' + e.valor + ' — ' + rotulaPreco(e.num).txt + '</li>';
            }).join('') + '</ul>'
          : '<p class="rel-tit">Sem aditivos neste ambiente.</p>') +
        '<p class="rel-rodape">Documento gerado pela tela de definição técnica. ' +
        'Vale como pré-projeto: o projeto executivo final é emitido pela equipe de projetos ' +
        'a partir destas mesmas escolhas.</p>' +
        '<button class="def-gerar" type="button" onclick="window.print()">Imprimir</button>' +
      '</div>';
    elLupa.hidden = false;
    document.body.classList.add('travado');
  }

  /* ── interação ─────────────────────────────────────────────── */
  elLista.addEventListener('click', function(e){
    var b = e.target.closest('.def-amb');
    if (!b) return;
    ambienteAtual = b.dataset.amb; blocoAtual = null;
    pinta();
    elPainel.scrollIntoView({ block:'start', behavior:'smooth' });
  });

  elPainel.addEventListener('click', function(e){
    var amb = ambiente(ambienteAtual), s = estado[amb.num], alvo;

    if ((alvo = e.target.closest('.def-aba'))) {
      blocoAtual = alvo.dataset.bloco; pintaPainel(); return;
    }
    if ((alvo = e.target.closest('.def-op-arte'))) {
      if (alvo.dataset.lupa) abreLupa(alvo.dataset.lupa); return;
    }
    if ((alvo = e.target.closest('#def-gerar'))) { relatorio(amb); return; }

    /* selecionar uma opção */
    if ((alvo = e.target.closest('.def-op-sel'))) {
      var sec = alvo.closest('.def-item'), ref = sec.dataset.ref, tipo = sec.dataset.tipo;
      var v = alvo.dataset.sel;
      var e0 = s.itens[ref] || (s.itens[ref] = { on:null, vars:[] });
      if (v === 'nao') { e0.on = false; e0.vars = []; }
      else if (tipo === 'multi') {
        e0.on = true;
        var k = +v, i = e0.vars.indexOf(k);
        if (i > -1) e0.vars.splice(i, 1); else e0.vars.push(k);
        e0.vars.sort(function(a, b){ return a - b; });
        if (!e0.vars.length) e0.on = null;    /* desmarcou tudo: volta a pendente */
      } else { e0.on = true; e0.vars = [+v]; }
      pinta(); return;
    }

    /* transições */
    if ((alvo = e.target.closest('#tr-add'))) {
      s.semTransicao = false;
      s.transicoes.push({ para:CONTRATO.ambientes.filter(function(a){
        return a.num !== amb.num; })[0].nome, tipo:'0', alinha:'0' });
      pinta(); return;
    }
    if ((alvo = e.target.closest('#tr-nenhuma'))) {
      s.semTransicao = !s.semTransicao; pinta(); return;
    }
    if ((alvo = e.target.closest('[data-tr-rem]'))) {
      s.transicoes.splice(+alvo.dataset.trRem, 1); pinta(); return;
    }
    if ((alvo = e.target.closest('[data-tr-tipo]'))) {
      s.transicoes[+alvo.dataset.trTipo].tipo = alvo.dataset.v; pinta(); return;
    }
    if ((alvo = e.target.closest('[data-tr-alinha]'))) {
      s.transicoes[+alvo.dataset.trAlinha].alinha = alvo.dataset.v; pinta(); return;
    }
  });

  elPainel.addEventListener('change', function(e){
    var sel = e.target.closest('[data-tr-para]');
    if (!sel) return;
    estado[ambienteAtual].transicoes[+sel.dataset.trPara].para = sel.value;
    pinta();
  });

  elLupa.addEventListener('click', function(e){
    if (e.target === elLupa || e.target.closest('#lupa-x')) fechaLupa();
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && !elLupa.hidden) fechaLupa();
  });

  pinta();
})();
