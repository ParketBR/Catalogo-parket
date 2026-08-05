/* ─────────────────────────────────────────────────────────────
   Detalhamento — os 16 desenhos que são escolha de projeto.
   Depende de dados.js (DETALHES).
   ───────────────────────────────────────────────────────────── */
(function(){
  'use strict';
  var $ = function(s){ return document.querySelector(s); };
  if (!$('#tec-idx')) return;

  /* Todas as folhas montadas de uma vez e trocadas por opacidade —
     comparar exige que nada recarregue. */
  var tecIdx = $('#tec-idx'), prancha = $('#prancha'),
      tecVar = $('#tec-var'), tecTxt = $('#tec-txt'),
      pilha  = $('#pilha'),   pilhaNota = $('#pilha-nota');

  var FOLHAS = DETALHES.reduce(function(acc, g){
    return acc.concat(g.itens.map(function(it){
      var o = {}; for (var k in it) o[k] = it[k]; o.grupo = g; return o;
    }));
  }, []);

  prancha.innerHTML = FOLHAS.map(function(f, i){
    return '<div class="folha' + (i === 0 ? ' on' : '') + '">' +
      '<img src="assets/tec/' + f.img + '.webp" alt="' + f.num + ' ' + f.nome + '" ' +
        (i === 0 ? '' : 'loading="lazy" ') + 'decoding="async">' +
    '</div>';
  }).join('');
  var folhas = [].slice.call(prancha.querySelectorAll('.folha'));

  tecIdx.innerHTML = DETALHES.map(function(g, i){
    return '<button class="grupo" type="button" data-g="' + i + '" aria-pressed="' + (i === 0) + '">' +
      '<span class="rot">' + g.nome + '</span>' +
      (g.itens.length > 1 ? '<span class="qt">' + g.itens.length + '</span>' : '') +
    '</button>';
  }).join('');

  var grupoIdx = 0;

  /* quem entra sobe: a folha que sai continua opaca por baixo até a
     nova cobrir (ver .folha em escopo.css). Sem empilhar, trocar
     rápido deixaria uma folha velha reaparecer por ordem de DOM. */
  var andar = 0;

  function verDetalhe(gi, ii){
    grupoIdx = gi;
    var g = DETALHES[gi], it = g.itens[ii];
    var global = FOLHAS.findIndex(function(f){ return f.num === it.num && f.img === it.img; });

    if (!folhas[global].classList.contains('on'))
      folhas[global].style.zIndex = ++andar;
    folhas.forEach(function(f, k){ f.classList.toggle('on', k === global); });
    [].forEach.call(tecIdx.querySelectorAll('.grupo'), function(b){
      b.setAttribute('aria-pressed', String(+b.dataset.g === gi));
    });

    /* uma só variante não vira botão: não há o que comparar */
    tecVar.innerHTML = g.itens.length < 2 ? '' : g.itens.map(function(v, k){
      return '<button class="var" type="button" data-v="' + k + '" aria-pressed="' + (k === ii) + '">' +
        v.nome + '</button>';
    }).join('');

    tecTxt.innerHTML =
      '<h3>' + it.titulo + '</h3><p>' + it.texto + '</p>' +
      (it.muda ? '<p class="muda"><b>O que muda</b>' + it.muda + '</p>' : '');

    /* a pilha acende a camada em que este detalhe age */
    [].forEach.call(pilha.querySelectorAll('.cam'), function(c){
      var alvo = c.dataset.cam === g.camada;
      /* as camadas que só existem em alguns detalhes aparecem sob demanda */
      if (['entre', 'encontro'].indexOf(c.dataset.cam) > -1)
        c.style.opacity = alvo ? '1' : '0';
      c.classList.toggle('acesa', alvo);
    });
    pilhaNota.textContent = g.nota;
  }

  /* API mínima para o escopo, que enriquece este mesmo índice:
     trocar a prancha sem simular clique, e avisar quando ele
     assume o clique no grupo — lá o nome também abre e fecha a
     lista de variantes, e um clique nosso desfaria isso. */
  window.Prancha = { ver: verDetalhe, cedido: false };

  tecIdx.addEventListener('click', function(e){
    var b = e.target.closest('.grupo');
    if (b && !window.Prancha.cedido) verDetalhe(+b.dataset.g, 0);
  });
  tecVar.addEventListener('click', function(e){
    var b = e.target.closest('.var');
    if (b) verDetalhe(grupoIdx, +b.dataset.v);
  });
  verDetalhe(0, 0);
})();
