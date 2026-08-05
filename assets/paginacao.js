/* ─────────────────────────────────────────────────────────────
   Seletor de paginação — a sala que troca de chão.
   Usado pela home e por piso.html. Sai fora se a página não
   tiver o bloco, então pode ser carregado em qualquer uma.
   Depende de dados.js (PAGINACOES, PISO_BASE).
   ───────────────────────────────────────────────────────────── */
(function(){
  'use strict';
  var $ = function(s){ return document.querySelector(s); };
  if (!$('#previa')) return;


  /* ═════ paginação ═════════════════════════════════════════
     Toda paginação é fotografada no MESMO ambiente, do mesmo
     ponto, com a mesma luz — só o chão muda. A sala vem de
     PISO_BASE e a foto da paginação entra por cima recortada no
     polígono do piso, de modo que a troca não mexa em teto,
     caixilho nem vista.
     ═══════════════════════════════════════════════════════ */
  var previa = $('#previa');

  previa.innerHTML =
    '<div class="quadro on" id="previa-sala">' +
      '<div class="enq"><img src="' + PISO_BASE + '" alt="" fetchpriority="high" decoding="async"></div>' +
    '</div>' +
    PAGINACOES.map(function(p, i){
      return '<div class="quadro' + (i === 0 ? ' on' : '') + '">' +
        '<div class="enq piso"><img src="' + p.img + '" alt="" loading="lazy" decoding="async"></div>' +
      '</div>';
    }).join('') +
    '<figcaption id="previa-nome"></figcaption>';

  /* a sala fica fora da lista indexada: ela não é uma opção, é o fundo */
  var previaSala = $('#previa-sala');
  var quadros = [].slice.call(previa.querySelectorAll('.quadro'))
                  .filter(function(q){ return q !== previaSala; });
  var previaNome = $('#previa-nome');
  var pagTxt = $('#pag-txt');
  var pagLista = $('#pag-lista');

  pagLista.innerHTML = PAGINACOES.map(function(p, i){
    return '<button class="sub" type="button" data-p="' + i + '" aria-pressed="' + (i === 0) + '">' +
      '<span class="rot">' + p.nome + '</span>' +
    '</button>';
  }).join('');

  var pagAtual = 0, varrendo = 0;

  function verPaginacao(i, comVarredura){
    var trocou = i !== pagAtual;
    pagAtual = i;
    var p = PAGINACOES[i];

    previaNome.textContent = p.nome;
    pagTxt.innerHTML = '<h3>' + p.titulo + '</h3><p>' + p.texto + '</p>';
    [].forEach.call(pagLista.querySelectorAll('.sub'), function(b){
      b.setAttribute('aria-pressed', String(+b.dataset.p === i));
    });

    clearTimeout(varrendo);
    quadros.forEach(function(q, k){
      q.classList.remove('assenta', 'radial');
      q.classList.toggle('frente', k === i);   /* o escolhido nunca é coberto por quem sai */
    });

    if (!comVarredura || !trocou){
      quadros.forEach(function(q, k){ q.classList.toggle('on', k === i); });
      return;
    }

    var novo = quadros[i];
    void novo.offsetWidth;                     /* reinicia a animação de máscara */
    novo.style.setProperty('--ang', p.ang || '0deg');
    novo.classList.toggle('radial', !!p.radial);
    novo.classList.add('on', 'assenta');
    varrendo = setTimeout(function(){
      quadros.forEach(function(q, k){
        q.classList.remove('assenta', 'radial');
        q.classList.toggle('on', k === pagAtual);
      });
    }, 1200);
  }

  pagLista.addEventListener('click', function(e){
    var b = e.target.closest('.sub');
    if (b) verPaginacao(+b.dataset.p, true);   /* assenta o estilo novo sobre o antigo */
  });
  verPaginacao(0);
})();
