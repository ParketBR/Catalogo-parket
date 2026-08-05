/* ─────────────────────────────────────────────────────────────
   Escopo — o índice das pranchas vira a lista onde o cliente
   monta o que quer no projeto, ambiente por ambiente.

   O modelo é o mesmo do resto da obra: nada é global, e nada é
   único por grupo. A mesma casa tem piso elevado com barrote na
   sala e com estrutura metálica no quarto — são duas soluções
   convivendo, cada uma no seu lugar. Por isso o ambiente pendura
   na VARIANTE, não no grupo.

   O que ainda é exclusivo: dentro de um grupo, um ambiente só
   aceita uma variante. Não existe sala com barrote e metálica ao
   mesmo tempo. A exceção é 3.2 Recorte, onde tomada e ralo
   convivem no mesmo cômodo.

   Roda DEPOIS de detalhamento.js e não reescreve o índice: só
   enriquece o que já está lá.

   Depende de dados.js (DETALHES) e precos.js (PRECOS).
   ───────────────────────────────────────────────────────────── */
(function(){
  'use strict';
  var idx = document.querySelector('#tec-idx');
  var alvo = document.querySelector('#escopo');
  var caixaAmb = document.querySelector('#ambientes');
  if (!idx || !alvo || !caixaAmb || typeof DETALHES === 'undefined') return;

  /* Só o que foge da regra "um ambiente, uma variante" aparece aqui. */
  var REGRA = {
    '3.2': { multi:true },               // tomada e ralo convivem no mesmo cômodo
  };

  /* Os cômodos que aparecem de saída. Um toque adiciona — quase
     ninguém precisa digitar, e ninguém precisa pensar em como
     nomear. A ordem é a da casa, não alfabética. */
  var SUGERIDOS = [
    'Sala', 'Sala de TV', 'Home theater', 'Cozinha', 'Varanda',
    'Hall', 'Corredor', 'Escada',
    'Suíte master', 'Closet', 'Quarto 1', 'Quarto 2',
    'Escritório', 'Lavabo',
  ];

  var CHAVE = 'parket:escopo:piso';
  var BRL = new Intl.NumberFormat('pt-BR', {
    style:'currency', currency:'BRL', maximumFractionDigits:0 });

  function regra(g){ return REGRA[g.num] || {}; }
  function preco(num){
    return (typeof PRECOS !== 'undefined' && num in PRECOS) ? PRECOS[num] : null;
  }
  function unidade(num){
    return (typeof PRECO_UNIDADE !== 'undefined' && PRECO_UNIDADE[num]) || '';
  }
  function rotulaPreco(num){
    var v = preco(num);
    if (v === null || v === undefined) return { txt:'a definir', vago:true };
    if (v === 0) return { txt:'incluso', vago:false };
    var u = unidade(num);
    return { txt: BRL.format(v) + (u ? ' /' + u : ''), vago:false };
  }
  function esc(s){
    return String(s).replace(/[&<>"]/g, function(c){
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c];
    });
  }

  /* ── estado ────────────────────────────────────────────────
     ambientes: lista de nomes, na ordem em que foram criados.
     Por grupo: { on, itens: { índiceDaVariante: { ambiente: qtd } } }
     A qtd pode ser null: o ambiente foi escolhido, a medida não.    */
  var ambientes = [];
  var versaoAmb = 0;          /* sobe a cada mudança na lista de ambientes */
  var estado = {};
  DETALHES.forEach(function(g){ estado[g.num] = { on:false, itens:{} }; });

  try {
    var salvo = JSON.parse(localStorage.getItem(CHAVE) || 'null');
    if (salvo) {
      if (Array.isArray(salvo.ambientes)) ambientes = salvo.ambientes.slice(0, 40);
      DETALHES.forEach(function(g){
        var s = (salvo.grupos || {})[g.num];
        if (!s) return;
        var itens = {};
        function limpa(lista){
          /* aceita tanto o formato antigo (array de ambientes) quanto o
             novo (mapa ambiente -> quantidade) */
          var o = {};
          if (Array.isArray(lista)) {
            lista.forEach(function(a){ if (ambientes.indexOf(a) > -1) o[a] = null; });
          } else if (lista) {
            Object.keys(lista).forEach(function(a){
              if (ambientes.indexOf(a) > -1) o[a] = lista[a];
            });
          }
          return o;
        }
        if (s.itens) {
          Object.keys(s.itens).forEach(function(k){
            if (+k >= 0 && +k < g.itens.length) itens[+k] = limpa(s.itens[k]);
          });
        } else if (Array.isArray(s.vars)) {
          s.vars.forEach(function(k){
            if (k >= 0 && k < g.itens.length) itens[k] = limpa(s.ambs);
          });
        }
        estado[g.num] = { on: !!s.on, itens: itens };
      });
    }
  } catch (e) { /* storage bloqueado: segue com o padrão */ }

  function qtsDe(gnum, k){
    var s = estado[gnum];
    return s.itens[k] || (s.itens[k] = {});
  }
  function ambsDe(gnum, k){ return Object.keys(qtsDe(gnum, k)); }

  function grava(){
    try {
      var g = {};
      DETALHES.forEach(function(d){ g[d.num] = estado[d.num]; });
      localStorage.setItem(CHAVE, JSON.stringify({ ambientes:ambientes, grupos:g }));
    } catch (e) {}
  }

  /* ── ambientes ─────────────────────────────────────────────── */
  function pintaAmbientes(){
    var pendentes = SUGERIDOS.filter(function(s){ return ambientes.indexOf(s) < 0; });
    caixaAmb.innerHTML =
      '<div class="amb-cab">' +
        '<h3>Ambientes da obra</h3>' +
        '<span class="amb-qt">' + (ambientes.length || 'nenhum') +
          (ambientes.length === 1 ? ' ambiente' : ambientes.length ? ' ambientes' : '') + '</span>' +
      '</div>' +
      '<p class="amb-nota">Toque nos cômodos que existem na obra. Cada detalhe é ' +
        'marcado depois nos ambientes onde entra — nada vale para a casa inteira.</p>' +
      '<div class="amb-chips">' +
        ambientes.map(function(a){
          return '<button type="button" class="amb on" data-amb="' + esc(a) + '">' +
            esc(a) + '<span class="amb-x" aria-hidden="true">×</span></button>';
        }).join('') +
        pendentes.map(function(a){
          return '<button type="button" class="amb" data-add="' + esc(a) + '">' + esc(a) + '</button>';
        }).join('') +
        '<button type="button" class="amb amb-novo" data-novo="1">+ outro</button>' +
      '</div>' +
      '<form class="amb-form" id="amb-form" hidden>' +
        '<input type="text" id="amb-nome" maxlength="28" placeholder="Nome do ambiente" ' +
          'aria-label="Nome do novo ambiente">' +
        '<button type="submit">Adicionar</button>' +
      '</form>';
  }

  function addAmbiente(nome){
    nome = (nome || '').trim().replace(/\s+/g, ' ');
    if (!nome || ambientes.length >= 40) return false;
    var existe = ambientes.some(function(a){ return a.toLowerCase() === nome.toLowerCase(); });
    if (existe) return false;
    ambientes.push(nome);
    versaoAmb++;
    return true;
  }

  function removeAmbiente(nome){
    ambientes = ambientes.filter(function(a){ return a !== nome; });
    versaoAmb++;
    DETALHES.forEach(function(g){
      var s = estado[g.num];
      Object.keys(s.itens).forEach(function(k){ delete s.itens[k][nome]; });
    });
  }

  caixaAmb.addEventListener('click', function(e){
    var add = e.target.closest('[data-add]');
    if (add) { addAmbiente(add.dataset.add); pintaAmbientes(); pinta(); return; }

    var novo = e.target.closest('[data-novo]');
    if (novo) {
      var f = caixaAmb.querySelector('#amb-form');
      f.hidden = false;
      f.querySelector('#amb-nome').focus();
      return;
    }

    var chip = e.target.closest('.amb.on');
    if (chip) { removeAmbiente(chip.dataset.amb); pintaAmbientes(); pinta(); }
  });

  caixaAmb.addEventListener('submit', function(e){
    e.preventDefault();
    var campo = caixaAmb.querySelector('#amb-nome');
    if (addAmbiente(campo.value)) { pintaAmbientes(); pinta(); }
    else { campo.select(); }
  });

  /* ── índice ────────────────────────────────────────────────── */
  function chipsOnde(){
    return '<span class="esc-onde-rot">Onde</span>' +
      ambientes.map(function(a){
        return '<button type="button" class="esc-amb" data-amb="' + esc(a) + '">' +
          esc(a) + '</button>';
      }).join('') +
      '<span class="esc-avisa-inline" hidden>escolha ao menos um</span>';
  }

  var botoes = [].slice.call(idx.querySelectorAll('.grupo'));

  botoes.forEach(function(btn){
    var gi = +btn.dataset.g, g = DETALHES[gi];
    var unico = g.itens.length === 1;

    var linha = document.createElement('div');
    linha.className = 'esc-linha';
    linha.dataset.g = gi;
    btn.parentNode.insertBefore(linha, btn);

    var marca = document.createElement('button');
    marca.type = 'button';
    marca.className = 'esc-marca';
    marca.setAttribute('aria-label', 'Incluir ' + g.nome + ' no escopo');
    linha.appendChild(marca);
    linha.appendChild(btn);

    var vlr = document.createElement('span');
    vlr.className = 'esc-preco';
    linha.appendChild(vlr);

    /* Grupo de um item só: o próprio grupo recebe os ambientes.
       Grupo com variantes: cada variante recebe os seus, porque a
       casa pode ter duas soluções do mesmo grupo em cômodos
       diferentes. */
    var corpo = document.createElement('div');
    corpo.className = unico ? 'esc-ondes' : 'esc-vars';
    if (!unico) {
      corpo.setAttribute('role', 'group');
      corpo.setAttribute('aria-label', 'Variantes de ' + g.nome);
      corpo.innerHTML = g.itens.map(function(it, k){
        return '<div class="esc-var-bloco" data-v="' + k + '">' +
          '<button type="button" class="esc-var" data-v="' + k + '">' +
            '<span class="esc-pino"></span>' +
            '<span class="esc-nome">' + esc(it.nome) + '</span>' +
            '<span class="esc-vpreco"></span>' +
          '</button>' +
          '<div class="esc-ondes" data-v="' + k + '"></div>' +
          '<div class="esc-qts" data-v="' + k + '" hidden></div>' +
        '</div>';
      }).join('');
    }
    linha.appendChild(corpo);

    /* item único não tem bloco de variante: a caixa de quantidade
       pendura direto na linha */
    var qts = document.createElement('div');
    qts.className = 'esc-qts';
    qts.hidden = true;
    if (unico) linha.appendChild(qts);

    linha._marca = marca; linha._vlr = vlr; linha._corpo = corpo;
    linha._unico = unico; linha._qts = qts;
  });

  var linhas = [].slice.call(idx.querySelectorAll('.esc-linha'));

  /* ── resumo ────────────────────────────────────────────────── */
  alvo.innerHTML =
    '<div class="esc-cab"><h3>Seu escopo</h3>' +
      '<span class="esc-qt-total" id="esc-qt"></span>' +
      '<button type="button" class="esc-limpar" id="esc-limpar" disabled>limpar</button>' +
    '</div>' +
    '<div class="esc-corpo" id="esc-corpo"></div>' +
    '<div class="esc-rodape">' +
      '<span class="esc-rot">Total</span>' +
      '<span class="esc-total" id="esc-total"></span>' +
    '</div>' +
    '<p class="esc-nota" id="esc-nota"></p>' +
    '<a class="esc-envia" id="esc-envia" href="contato.html">Enviar para a Parket</a>';

  var elCorpo = alvo.querySelector('#esc-corpo'),
      elQt    = alvo.querySelector('#esc-qt'),
      elTotal = alvo.querySelector('#esc-total'),
      elNota  = alvo.querySelector('#esc-nota'),
      elEnvia = alvo.querySelector('#esc-envia'),
      elLimpa = alvo.querySelector('#esc-limpar');

  /* Limpar em dois toques: o primeiro arma e o botão diz o que vai
     acontecer, o segundo executa. Os ambientes ficam — eles são fato
     da casa, não escolha de escopo; para tirar um, o × do chip. */
  var armado = false;
  function desarma(){
    if (!armado) return;
    armado = false;
    elLimpa.classList.remove('armado');
    elLimpa.textContent = 'limpar';
  }
  elLimpa.addEventListener('click', function(){
    if (!armado) {
      armado = true;
      elLimpa.classList.add('armado');
      elLimpa.textContent = 'apagar tudo?';
      return;
    }
    DETALHES.forEach(function(g){ estado[g.num] = { on:false, itens:{} }; });
    desarma();
    pinta();
  });
  document.addEventListener('click', function(e){
    if (armado && !e.target.closest('#esc-limpar')) desarma();
  });

  /* Uma escolha é o par variante × ambiente — é assim que a obra
     conta e é assim que o preço vai contar. */
  function escolhas(){
    var out = [];
    DETALHES.forEach(function(g){
      var s = estado[g.num];
      if (!s.on) return;
      var usou = false;
      g.itens.forEach(function(it, k){
        var qts = s.itens[k] || {};
        Object.keys(qts).forEach(function(a){
          usou = true;
          out.push({ grupo:g, item:it, amb:a, qt:qts[a] });
        });
      });
      /* ligado e sem nenhum ambiente em nenhuma variante */
      if (!usou) out.push({ grupo:g, item:g.itens[0], amb:null });
    });
    return out;
  }

  /* `cobra` só é verdade onde vazio de fato é problema. Numa
     variante, vazio significa "esta solução não foi usada" — que é
     normal e é a maioria dos casos. Cobrar ali encheria a coluna de
     alarme falso. */
  /* Uma linha de quantidade por ambiente escolhido, só se o item
     tiver unidade. `qts` é o mapa ambiente -> quantidade. */
  function atualizaQts(caixa, item, qts){
    var un = unidade(item.num);
    caixa.hidden = !un || !Object.keys(qts).length;
    if (caixa.hidden) return;
    var ambs = Object.keys(qts);
    var assinatura = un + '|' + ambs.join('|');
    if (caixa.dataset.a !== assinatura) {
      caixa.dataset.a = assinatura;
      caixa.innerHTML = ambs.map(function(a){
        return '<label class="esc-qt"><span class="esc-qt-amb">' + esc(a) + '</span>' +
          '<input type="number" min="0" step="0.01" inputmode="decimal" ' +
            'data-amb="' + esc(a) + '" aria-label="Quantidade em ' + esc(a) + '">' +
          '<span class="esc-qt-un">' + esc(un) + '</span>' +
          '<span class="esc-qt-sub"></span></label>';
      }).join('');
    }
    var v = preco(item.num);
    [].forEach.call(caixa.querySelectorAll('input'), function(inp){
      var q = qts[inp.dataset.amb];
      if (document.activeElement !== inp) inp.value = (q === null || q === undefined) ? '' : q;
      var sub = inp.parentNode.querySelector('.esc-qt-sub');
      var temQt = typeof q === 'number' && q > 0;
      /* sem preço publicado a quantidade ainda serve: vira medida no
         pré-projeto. Por isso mostra a medida, não um total falso. */
      sub.textContent = !temQt ? 'sob consulta'
        : (v === null || v === undefined) ? q + ' ' + un
        : BRL.format(q * v);
      sub.classList.toggle('vago', !temQt || v === null || v === undefined);
    });
  }

  function atualizaOndes(o, lista, cobra){
    if (o.dataset.v_amb !== String(versaoAmb)) {
      o.dataset.v_amb = String(versaoAmb);
      o.innerHTML = ambientes.length ? chipsOnde()
        : '<p class="esc-avisa">Cadastre os ambientes acima para dizer onde este detalhe entra.</p>';
    }
    if (!ambientes.length) return;
    [].forEach.call(o.querySelectorAll('.esc-amb'), function(b){
      var sel = lista.indexOf(b.dataset.amb) > -1;
      b.classList.toggle('on', sel);
      b.setAttribute('aria-pressed', String(sel));
    });
    o.querySelector('.esc-avisa-inline').hidden = !cobra || lista.length > 0;
  }

  function pinta(){
    linhas.forEach(function(linha){
      var g = DETALHES[+linha.dataset.g], s = estado[g.num];

      linha.classList.toggle('on', s.on);
      linha._marca.setAttribute('aria-pressed', String(s.on));
      linha._corpo.hidden = !s.on;

      var emUso = 0;
      g.itens.forEach(function(it, k){ if ((s.itens[k] || []).length) emUso++; });
      linha.classList.toggle('sem-amb', s.on && ambientes.length > 0 && !emUso);

      if (linha._unico) {
        var p = rotulaPreco(g.itens[0].num);
        linha._vlr.textContent = s.on ? p.txt : '';
        linha._vlr.classList.toggle('vago', s.on && p.vago);
        if (s.on) {
          atualizaOndes(linha._corpo, ambsDe(g.num, 0), true);
          atualizaQts(linha._qts, g.itens[0], qtsDe(g.num, 0));
        } else { linha._qts.hidden = true; }
        return;
      }

      /* com variantes o preço da linha do grupo seria mentira:
         cada variante tem o seu. A linha mostra quantas estão em uso. */
      linha._vlr.textContent = s.on && emUso
        ? emUso + (emUso === 1 ? ' solução' : ' soluções') : '';
      linha._vlr.classList.remove('vago');

      if (!s.on) return;
      [].forEach.call(linha._corpo.querySelectorAll('.esc-var-bloco'), function(bloco){
        var k = +bloco.dataset.v, lista = ambsDe(g.num, k);
        var bt = bloco.querySelector('.esc-var');
        bt.classList.toggle('on', lista.length > 0);
        bt.setAttribute('aria-pressed', String(lista.length > 0));
        var pv = bloco.querySelector('.esc-vpreco');
        var p2 = rotulaPreco(g.itens[k].num);
        pv.textContent = p2.txt;
        pv.classList.toggle('vago', p2.vago);
        /* grupo ligado e nenhuma variante usada: a cobrança vai na
           primeira, para o cliente ter onde clicar sem procurar */
        atualizaOndes(bloco.querySelector('.esc-ondes'), lista, !emUso && k === 0);
        atualizaQts(bloco.querySelector('.esc-qts'), g.itens[k], qtsDe(g.num, k));
      });
    });

    /* resumo agrupado por ambiente: é a leitura que o orçamento usa */
    var todas = escolhas();
    var semAmb = todas.filter(function(e){ return !e.amb; });
    var mapa = {};
    ambientes.forEach(function(a){ mapa[a] = []; });
    todas.forEach(function(e){ if (e.amb && mapa[e.amb]) mapa[e.amb].push(e); });

    var comAlgo = ambientes.filter(function(a){ return mapa[a].length; });
    elQt.textContent = !todas.length ? 'vazio'
      : comAlgo.length ? comAlgo.length + (comAlgo.length === 1 ? ' ambiente' : ' ambientes')
      : todas.length + (todas.length === 1 ? ' item' : ' itens');

    function li(e, forcaVago){
      var un = unidade(e.item.num), v = preco(e.item.num);
      var temQt = typeof e.qt === 'number' && e.qt > 0;
      var p = forcaVago ? { txt:'onde?', vago:true }
            : (temQt && v !== null && v !== undefined)
              ? { txt: BRL.format(e.qt * v), vago:false }
              : rotulaPreco(e.item.num);
      /* a medida informada entra como sobrescrito do item: é o dado
         que o pré-projeto precisa mesmo antes de haver preço */
      var medida = temQt ? ' · ' + e.qt + ' ' + un : '';
      return '<li><span class="esc-par">' +
        '<span class="esc-g">' + esc(e.grupo.nome) + medida + '</span>' +
        '<span class="esc-i">' + esc(e.item.nome) + '</span></span>' +
        '<span class="esc-p' + (p.vago ? ' vago' : '') + '">' + p.txt + '</span></li>';
    }

    var html = comAlgo.map(function(a){
      return '<div class="esc-bloco">' +
        '<h4 class="esc-amb-tit">' + esc(a) + '<span>' + mapa[a].length + '</span></h4>' +
        '<ul class="esc-lista">' + mapa[a].map(function(e){ return li(e, false); }).join('') +
        '</ul></div>';
    }).join('');

    if (semAmb.length) {
      html += '<div class="esc-bloco pendente">' +
        '<h4 class="esc-amb-tit">Sem ambiente<span>' + semAmb.length + '</span></h4>' +
        '<ul class="esc-lista">' + semAmb.map(function(e){ return li(e, true); }).join('') +
        '</ul></div>';
    }

    elCorpo.innerHTML = html ||
      '<p class="esc-vazio">Marque os detalhes ao lado e diga em quais ambientes eles entram.</p>';

    var pagos = todas.filter(function(e){ return e.amb; });
    /* só fecha conta quem tem preço publicado e, se cobra por medida,
       a medida informada. Qualquer buraco derruba o total inteiro. */
    var falta = !pagos.length || pagos.some(function(e){
      var v = preco(e.item.num);
      if (v === null || v === undefined) return true;
      return unidade(e.item.num) && !(typeof e.qt === 'number' && e.qt > 0);
    });
    var soma = pagos.reduce(function(a, e){
      var v = preco(e.item.num) || 0;
      return a + (unidade(e.item.num) ? v * (e.qt || 0) : v);
    }, 0);
    elTotal.textContent = falta ? 'sob consulta' : BRL.format(soma);
    elTotal.classList.toggle('vago', falta);
    elNota.textContent = !todas.length
      ? 'Monte o escopo ao lado. O valor fechado sai no pré-projeto.'
      : semAmb.length
      ? 'Há item sem ambiente definido. Diga onde ele entra para fechar o escopo.'
      : falta
      ? 'Alguns itens ainda não têm valor publicado. O orçamento fechado sai no pré-projeto, com as medidas de cada ambiente.'
      : 'Estimativa. O valor fechado sai no pré-projeto, com as medidas de cada ambiente.';

    elEnvia.classList.toggle('off', !todas.length);
    /* Fica sempre à vista, só apagado quando não há o que limpar.
       Escondê-lo fazia o botão sumir justo na hora de procurá-lo. */
    elLimpa.disabled = !todas.length;
    if (!todas.length) desarma();
    grava();
  }

  /* ── interação no índice ───────────────────────────────────── */
  idx.addEventListener('click', function(e){
    var linha = e.target.closest('.esc-linha');
    if (!linha) return;
    var g = DETALHES[+linha.dataset.g], s = estado[g.num];

    var m = e.target.closest('.esc-marca');
    if (m) { s.on = !s.on; pinta(); return; }

    var a = e.target.closest('.esc-amb');
    if (a) {
      var bloco = a.closest('.esc-var-bloco');
      var k = bloco ? +bloco.dataset.v : 0;
      var nome = a.dataset.amb, qts = qtsDe(g.num, k);
      if (nome in qts) {
        delete qts[nome];
      } else {
        /* um ambiente, uma variante — a irmã solta o cômodo */
        if (!regra(g).multi) {
          Object.keys(s.itens).forEach(function(outro){
            if (+outro !== k) delete s.itens[outro][nome];
          });
        }
        qts[nome] = null;
      }
      pinta();
      return;
    }

    /* o nome da variante não escolhe: mostra. Escolher é marcar o
       ambiente — uma interação só, sem dois significados no mesmo clique. */
    var v = e.target.closest('.esc-var');
    if (v && window.Prancha && !window.Prancha.cedido)
      window.Prancha.ver(+linha.dataset.g, +v.dataset.v);
  });

  idx.addEventListener('input', function(e){
    var inp = e.target.closest('.esc-qts input');
    if (!inp) return;
    var linha = inp.closest('.esc-linha');
    var g = DETALHES[+linha.dataset.g];
    var bloco = inp.closest('.esc-var-bloco');
    var qts = qtsDe(g.num, bloco ? +bloco.dataset.v : 0);
    var v = parseFloat(inp.value.replace(',', '.'));
    qts[inp.dataset.amb] = (isFinite(v) && v > 0) ? v : null;
    pinta();
  });

  /* Entrega o escopo à página de contato. Não envia nada: só
     deixa pronto no formulário, e quem aperta enviar é o cliente. */
  elEnvia.addEventListener('click', function(ev){
    var todas = escolhas();
    if (!todas.length) { ev.preventDefault(); return; }
    var porAmb = {};
    todas.forEach(function(e){
      var chave = e.amb || 'Ambiente a definir';
      (porAmb[chave] = porAmb[chave] || []).push(e);
    });
    var txt = 'Montei meu escopo de piso no site:\n\n' +
      Object.keys(porAmb).map(function(a){
        return a.toUpperCase() + '\n' + porAmb[a].map(function(e){
          var un = unidade(e.item.num);
          var med = (typeof e.qt === 'number' && e.qt > 0) ? '  — ' + e.qt + ' ' + un
                  : un ? '  — medida a levantar' : '';
          return '  • ' + e.grupo.nome + ': ' + e.item.nome + med + '  (' + e.item.num + ')';
        }).join('\n');
      }).join('\n\n') + '\n\nGostaria de receber o orçamento.';
    try { sessionStorage.setItem('parket:escopo:msg', txt); } catch (err) {}
  });

  pintaAmbientes();
  pinta();
})();
