/* ─────────────────────────────────────────────────────────────
   Escopo de forro — mesma lógica do piso, sem prancha.

   O forro ainda não tem desenho de corte no acervo, então aqui a
   lista de escolha nasce da própria tabela de preços: cada item de
   PRECOS_FORRO é uma coisa que o cliente pode pedir, e cada uma é
   marcada nos ambientes onde entra.

   A diferença que importa é a unidade. Item por UNI o cliente sabe
   contar (quantas luminárias, quantos alçapões) e a conta fecha.
   Item por MTL depende de medida que só existe depois da vistoria —
   nesse caso a quantidade fica em branco e a linha diz "sob
   consulta" em vez de inventar um número.

   Os nomes de classe `esc-*` são compartilhados com o piso e moram
   em escopo.css.

   Depende de precos-forro.js.
   ───────────────────────────────────────────────────────────── */
(function(){
  'use strict';
  var caixaAmb = document.querySelector('#ambientes');
  var lista    = document.querySelector('#forro-lista');
  var alvo     = document.querySelector('#escopo');
  if (!caixaAmb || !lista || !alvo || typeof PRECOS_FORRO === 'undefined') return;

  var ITENS = Object.keys(PRECOS_FORRO).map(function(id){
    var o = PRECOS_FORRO[id];
    return { id:id, nome:o.nome, un:o.un, valor:o.valor };
  });

  var UN_EXTENSO = { UNI:'un', MTL:'m linear', M2:'m²' };

  var SUGERIDOS = [
    'Sala', 'Sala de TV', 'Home theater', 'Cozinha', 'Varanda',
    'Hall', 'Corredor', 'Suíte master', 'Closet', 'Quarto 1',
    'Quarto 2', 'Escritório', 'Lavabo',
  ];

  var CHAVE = 'parket:escopo:forro';
  var BRL = new Intl.NumberFormat('pt-BR', {
    style:'currency', currency:'BRL', maximumFractionDigits:0 });

  function esc(s){
    return String(s).replace(/[&<>"]/g, function(c){
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c];
    });
  }
  function un(i){ return UN_EXTENSO[i.un] || i.un; }

  /* ── estado ────────────────────────────────────────────────
     Por item: { on, qt: { ambiente: número|null } }
     A chave do mapa qt é o ambiente onde o item entra; o valor é a
     quantidade, que pode ficar vazia.                            */
  var ambientes = [];
  var versaoAmb = 0;
  var estado = {};
  ITENS.forEach(function(i){ estado[i.id] = { on:false, qt:{} }; });

  try {
    var salvo = JSON.parse(localStorage.getItem(CHAVE) || 'null');
    if (salvo) {
      if (Array.isArray(salvo.ambientes)) ambientes = salvo.ambientes.slice(0, 40);
      ITENS.forEach(function(i){
        var s = (salvo.itens || {})[i.id];
        if (!s) return;
        var qt = {};
        Object.keys(s.qt || {}).forEach(function(a){
          if (ambientes.indexOf(a) > -1) qt[a] = s.qt[a];
        });
        estado[i.id] = { on: !!s.on, qt: qt };
      });
    }
  } catch (e) {}

  function grava(){
    try {
      localStorage.setItem(CHAVE, JSON.stringify({ ambientes:ambientes, itens:estado }));
    } catch (e) {}
  }

  /* ── ambientes ─────────────────────────────────────────────── */
  function pintaAmbientes(){
    var pendentes = SUGERIDOS.filter(function(s){ return ambientes.indexOf(s) < 0; });
    caixaAmb.innerHTML =
      '<div class="amb-cab"><h3>Ambientes da obra</h3>' +
        '<span class="amb-qt">' + (ambientes.length || 'nenhum') +
          (ambientes.length === 1 ? ' ambiente' : ambientes.length ? ' ambientes' : '') +
        '</span></div>' +
      '<p class="amb-nota">Toque nos cômodos que existem na obra. Cada item é ' +
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
        '<button type="submit">Adicionar</button></form>';
  }

  function addAmbiente(nome){
    nome = (nome || '').trim().replace(/\s+/g, ' ');
    if (!nome || ambientes.length >= 40) return false;
    if (ambientes.some(function(a){ return a.toLowerCase() === nome.toLowerCase(); })) return false;
    ambientes.push(nome); versaoAmb++;
    return true;
  }
  function removeAmbiente(nome){
    ambientes = ambientes.filter(function(a){ return a !== nome; });
    versaoAmb++;
    ITENS.forEach(function(i){ delete estado[i.id].qt[nome]; });
  }

  caixaAmb.addEventListener('click', function(e){
    var add = e.target.closest('[data-add]');
    if (add) { addAmbiente(add.dataset.add); pintaAmbientes(); pinta(); return; }
    var novo = e.target.closest('[data-novo]');
    if (novo) {
      var f = caixaAmb.querySelector('#amb-form');
      f.hidden = false; f.querySelector('#amb-nome').focus();
      return;
    }
    var chip = e.target.closest('.amb.on');
    if (chip) { removeAmbiente(chip.dataset.amb); pintaAmbientes(); pinta(); }
  });
  caixaAmb.addEventListener('submit', function(e){
    e.preventDefault();
    var campo = caixaAmb.querySelector('#amb-nome');
    if (addAmbiente(campo.value)) { pintaAmbientes(); pinta(); } else campo.select();
  });

  /* ── lista de itens ────────────────────────────────────────── */
  lista.innerHTML = ITENS.map(function(i){
    return '<div class="esc-linha" data-i="' + esc(i.id) + '">' +
      '<button type="button" class="esc-marca" aria-label="Incluir ' + esc(i.nome) + '"></button>' +
      '<span class="fr-nome">' + esc(i.nome) + '</span>' +
      '<span class="esc-preco">' + BRL.format(i.valor) + ' /' + un(i) + '</span>' +
      '<div class="esc-ondes"></div>' +
      '<div class="esc-qts" hidden></div>' +
    '</div>';
  }).join('');

  var linhas = [].slice.call(lista.querySelectorAll('.esc-linha'));

  function chipsOnde(){
    return '<span class="esc-onde-rot">Onde</span>' +
      ambientes.map(function(a){
        return '<button type="button" class="esc-amb" data-amb="' + esc(a) + '">' + esc(a) + '</button>';
      }).join('') +
      '<span class="esc-avisa-inline" hidden>escolha ao menos um</span>';
  }

  /* ── resumo ────────────────────────────────────────────────── */
  alvo.innerHTML =
    '<div class="esc-cab"><h3>Seu escopo</h3>' +
      '<span class="esc-qt-total" id="esc-qt"></span>' +
      '<button type="button" class="esc-limpar" id="esc-limpar" disabled>limpar</button>' +
    '</div>' +
    '<div class="esc-corpo" id="esc-corpo"></div>' +
    '<div class="esc-rodape"><span class="esc-rot">Total</span>' +
      '<span class="esc-total" id="esc-total"></span></div>' +
    '<p class="esc-nota" id="esc-nota"></p>' +
    '<a class="esc-envia" id="esc-envia" href="contato.html">Enviar para a Parket</a>';

  var elCorpo = alvo.querySelector('#esc-corpo'),
      elQt    = alvo.querySelector('#esc-qt'),
      elTotal = alvo.querySelector('#esc-total'),
      elNota  = alvo.querySelector('#esc-nota'),
      elEnvia = alvo.querySelector('#esc-envia'),
      elLimpa = alvo.querySelector('#esc-limpar');

  /* Mesma regra do piso: dois toques, e os ambientes permanecem. */
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
    ITENS.forEach(function(i){ estado[i.id] = { on:false, qt:{} }; });
    desarma();
    pinta();
  });
  document.addEventListener('click', function(e){
    if (armado && !e.target.closest('#esc-limpar')) desarma();
  });

  function escolhas(){
    var out = [];
    ITENS.forEach(function(i){
      var s = estado[i.id];
      if (!s.on) return;
      var ambs = Object.keys(s.qt);
      if (!ambs.length) { out.push({ item:i, amb:null, qt:null }); return; }
      ambs.forEach(function(a){ out.push({ item:i, amb:a, qt:s.qt[a] }); });
    });
    return out;
  }

  function pinta(){
    linhas.forEach(function(linha){
      var i = ITENS.filter(function(x){ return x.id === linha.dataset.i; })[0];
      var s = estado[i.id], ambs = Object.keys(s.qt);

      linha.classList.toggle('on', s.on);
      linha.querySelector('.esc-marca').setAttribute('aria-pressed', String(s.on));
      linha.classList.toggle('sem-amb', s.on && ambientes.length > 0 && !ambs.length);

      var o = linha.querySelector('.esc-ondes');
      var qts = linha.querySelector('.esc-qts');
      o.hidden = !s.on; qts.hidden = !s.on || !ambs.length;
      if (!s.on) return;

      if (o.dataset.v !== String(versaoAmb)) {
        o.dataset.v = String(versaoAmb);
        o.innerHTML = ambientes.length ? chipsOnde()
          : '<p class="esc-avisa">Cadastre os ambientes acima para dizer onde este item entra.</p>';
      }
      if (!ambientes.length) return;
      [].forEach.call(o.querySelectorAll('.esc-amb'), function(b){
        var sel = ambs.indexOf(b.dataset.amb) > -1;
        b.classList.toggle('on', sel);
        b.setAttribute('aria-pressed', String(sel));
      });
      o.querySelector('.esc-avisa-inline').hidden = ambs.length > 0;

      /* uma linha de quantidade por ambiente escolhido — só dos
         escolhidos, para a lista crescer com o uso e não com o menu */
      var assinatura = ambs.join('|');
      if (qts.dataset.a !== assinatura) {
        qts.dataset.a = assinatura;
        qts.innerHTML = ambs.map(function(a){
          return '<label class="esc-qt"><span class="esc-qt-amb">' + esc(a) + '</span>' +
            '<input type="number" min="0" step="0.01" inputmode="decimal" ' +
              'data-amb="' + esc(a) + '" aria-label="Quantidade em ' + esc(a) + '">' +
            '<span class="esc-qt-un">' + esc(un(i)) + '</span>' +
            '<span class="esc-qt-sub"></span></label>';
        }).join('');
      }
      [].forEach.call(qts.querySelectorAll('input'), function(inp){
        var v = s.qt[inp.dataset.amb];
        if (document.activeElement !== inp) inp.value = (v === null || v === undefined) ? '' : v;
        var sub = inp.parentNode.querySelector('.esc-qt-sub');
        var ok = typeof v === 'number' && v > 0;
        sub.textContent = ok ? BRL.format(v * i.valor) : 'sob consulta';
        sub.classList.toggle('vago', !ok);
      });
    });

    var todas = escolhas();
    var semAmb = todas.filter(function(e){ return !e.amb; });
    var mapa = {};
    ambientes.forEach(function(a){ mapa[a] = []; });
    todas.forEach(function(e){ if (e.amb && mapa[e.amb]) mapa[e.amb].push(e); });
    var comAlgo = ambientes.filter(function(a){ return mapa[a].length; });

    elQt.textContent = !todas.length ? 'vazio'
      : comAlgo.length ? comAlgo.length + (comAlgo.length === 1 ? ' ambiente' : ' ambientes')
      : todas.length + (todas.length === 1 ? ' item' : ' itens');

    function li(e){
      var ok = typeof e.qt === 'number' && e.qt > 0;
      var val = e.amb === null ? 'onde?' : (ok ? BRL.format(e.qt * e.item.valor) : 'sob consulta');
      var qtd = ok ? e.qt + ' ' + un(e.item) : '';
      return '<li><span class="esc-par">' +
        '<span class="esc-g">' + esc(e.item.nome) + '</span>' +
        '<span class="esc-i">' + (qtd || BRL.format(e.item.valor) + ' /' + un(e.item)) + '</span>' +
        '</span><span class="esc-p' + (ok ? '' : ' vago') + '">' + val + '</span></li>';
    }

    var html = comAlgo.map(function(a){
      return '<div class="esc-bloco"><h4 class="esc-amb-tit">' + esc(a) +
        '<span>' + mapa[a].length + '</span></h4><ul class="esc-lista">' +
        mapa[a].map(li).join('') + '</ul></div>';
    }).join('');
    if (semAmb.length) {
      html += '<div class="esc-bloco pendente"><h4 class="esc-amb-tit">Sem ambiente' +
        '<span>' + semAmb.length + '</span></h4><ul class="esc-lista">' +
        semAmb.map(li).join('') + '</ul></div>';
    }
    elCorpo.innerHTML = html ||
      '<p class="esc-vazio">Marque os itens ao lado e diga em quais ambientes eles entram.</p>';

    var pagos = todas.filter(function(e){ return e.amb; });
    var semQt = pagos.filter(function(e){ return !(typeof e.qt === 'number' && e.qt > 0); });
    var soma = pagos.reduce(function(a, e){
      return a + (typeof e.qt === 'number' ? e.qt * e.item.valor : 0);
    }, 0);
    var podeSomar = pagos.length && !semQt.length;
    elTotal.textContent = podeSomar ? BRL.format(soma) : 'sob consulta';
    elTotal.classList.toggle('vago', !podeSomar);
    elNota.textContent = !todas.length
      ? 'Marque os itens ao lado. A quantidade é opcional — sem ela o valor sai no pré-projeto.'
      : semAmb.length
      ? 'Há item sem ambiente definido. Diga onde ele entra para fechar o escopo.'
      : semQt.length
      ? semQt.length + (semQt.length === 1 ? ' item ainda sem quantidade' : ' itens ainda sem quantidade') +
        '. Preencha o que você souber; o resto é medido na vistoria.'
      : 'Estimativa pelas quantidades informadas. O valor fechado sai depois da medição em obra.';

    elEnvia.classList.toggle('off', !todas.length);
    /* Fica sempre à vista, só apagado quando não há o que limpar.
       Escondê-lo fazia o botão sumir justo na hora de procurá-lo. */
    elLimpa.disabled = !todas.length;
    if (!todas.length) desarma();
    grava();
  }

  /* ── interação ─────────────────────────────────────────────── */
  lista.addEventListener('click', function(e){
    var linha = e.target.closest('.esc-linha');
    if (!linha) return;
    var s = estado[linha.dataset.i];

    if (e.target.closest('.esc-marca')) { s.on = !s.on; pinta(); return; }

    var a = e.target.closest('.esc-amb');
    if (a) {
      var nome = a.dataset.amb;
      if (nome in s.qt) delete s.qt[nome]; else s.qt[nome] = null;
      pinta();
    }
  });

  lista.addEventListener('input', function(e){
    var inp = e.target.closest('.esc-qts input');
    if (!inp) return;
    var s = estado[e.target.closest('.esc-linha').dataset.i];
    var v = parseFloat(inp.value.replace(',', '.'));
    s.qt[inp.dataset.amb] = (isFinite(v) && v > 0) ? v : null;
    pinta();
  });

  elEnvia.addEventListener('click', function(ev){
    var todas = escolhas();
    if (!todas.length) { ev.preventDefault(); return; }
    var porAmb = {};
    todas.forEach(function(e){
      var c = e.amb || 'Ambiente a definir';
      (porAmb[c] = porAmb[c] || []).push(e);
    });
    var txt = 'Montei meu escopo de forro no site:\n\n' +
      Object.keys(porAmb).map(function(a){
        return a.toUpperCase() + '\n' + porAmb[a].map(function(e){
          var q = (typeof e.qt === 'number' && e.qt > 0) ? e.qt + ' ' + un(e.item) : 'quantidade a medir';
          return '  • ' + e.item.nome + ' — ' + q;
        }).join('\n');
      }).join('\n\n') + '\n\nGostaria de receber o orçamento.';
    try { sessionStorage.setItem('parket:escopo:msg', txt); } catch (err) {}
  });

  pintaAmbientes();
  pinta();
})();
