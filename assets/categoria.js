/* ─────────────────────────────────────────────────────────────
   Página de categoria — a parte que as nove compartilham:
   as etapas do serviço e a navegação para as vizinhas.

   O serviço é identificado pelo nome do arquivo (piso.html →
   slug 'piso'), então não há um id repetido em cada página para
   sair de sincronia com dados.js.
   ───────────────────────────────────────────────────────────── */
(function(){
  'use strict';

  var slug = (location.pathname.split('/').pop() || '').replace('.html', '');
  var i = SERVICOS.findIndex(function(s){ return s.slug === slug; });
  if (i < 0) return;
  var servico = SERVICOS[i];

  /* ── etapas ───────────────────────────────────────────────
     A etapa de paginação sai daqui: em piso.html ela tem seção
     própria, e nas outras páginas ela não existe. `data-limite`
     corta a lista quando o resto já é coberto mais abaixo. */
  var alvo = document.getElementById('etapas');
  if (alvo){
    var lista = servico.etapas.filter(function(e){ return !e.paginacao; });
    var limite = parseInt(alvo.dataset.limite, 10);
    if (limite > 0) lista = lista.slice(0, limite);

    /* Duas leituras da mesma lista: a linha do tempo mostra o
       percurso inteiro de uma vez e abre uma etapa por clique; as
       fileiras alternadas dão uma tela a cada etapa. */
    if (alvo.dataset.formato === 'linha'){
      alvo.className = 'linha-tempo';
      alvo.innerHTML =
        '<div class="lt-trilho">' +
          lista.map(function(e, k){
            return '<button class="lt-no" type="button" data-i="' + k + '"' +
              ' aria-pressed="' + (k === 0) + '">' +
              '<span class="lt-bola"></span>' +
              '<span class="lt-ord">' + String(k + 1).padStart(2, '0') + '</span>' +
              '<span class="lt-nome">' + (e.curto || e.etapa) + '</span>' +
              '<span class="lt-nota">' + (e.nota || '') + '</span>' +
            '</button>';
          }).join('') +
        '</div>' +
        '<div class="lt-painel" id="lt-painel" aria-live="polite"></div>';

      var painel = alvo.querySelector('#lt-painel');
      var nos = [].slice.call(alvo.querySelectorAll('.lt-no'));
      var abre = function(k){
        var e = lista[k];
        /* a etapa desenhada ganha do banco de imagem: onde existe
           corte em secoes.js é ele que entra, e a foto só serve de
           reserva para as categorias que ainda não têm desenho */
        var sec = (typeof SECOES !== 'undefined') && SECOES[e.num];
        nos.forEach(function(n){ n.setAttribute('aria-pressed', String(+n.dataset.i === k)); });
        painel.innerHTML =
          (sec
            ? '<figure class="lt-foto lt-desenho">' + sec + '</figure>'
            : '<figure class="lt-foto"><img src="' + e.img + '" alt="' +
                servico.nome + ' — ' + e.etapa + '" decoding="async"></figure>') +
          '<div class="lt-txt">' +
            '<p class="kicker">' + e.etapa + '</p>' +
            '<h3>' + e.titulo + '</h3>' +
            '<p>' + e.texto + '</p>' +
          '</div>';
      };
      nos.forEach(function(n){
        n.addEventListener('click', function(){ abre(+n.dataset.i); });
      });
      abre(0);
      return;
    }

    alvo.innerHTML = lista.map(function(e, k){
      return '<article class="etapa">' +
        '<figure class="etapa-foto">' +
          '<img src="' + e.img + '" alt="' + servico.nome + ' — ' + e.etapa + '" ' +
            (k === 0 ? '' : 'loading="lazy" ') + 'decoding="async">' +
        '</figure>' +
        '<div>' +
          '<p class="kicker">' + e.etapa + '</p>' +
          '<h3>' + e.titulo + '</h3>' +
          '<p>' + e.texto + '</p>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  /* ── vizinhas ─────────────────────────────────────────────
     Percorre o catálogo em círculo, na ordem da LISTA BIBLIOTECA. */
  var nav = document.getElementById('vizinhas');
  if (nav){
    var ant = SERVICOS[(i - 1 + SERVICOS.length) % SERVICOS.length];
    var pro = SERVICOS[(i + 1) % SERVICOS.length];
    nav.innerHTML =
      '<a href="' + ant.slug + '.html"><span class="rot">Anterior</span><span>' + ant.nome + '</span></a>' +
      '<a href="' + pro.slug + '.html"><span class="rot">Próximo</span><span>' + pro.nome + '</span></a>';
  }
})();
