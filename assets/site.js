/* ─────────────────────────────────────────────────────────────
   Parket — chassi do site.

   Monta o que toda página tem: atalho de acessibilidade, cabeçalho
   com a navegação inteira, gaveta de menu no toque e rodapé.
   Script clássico, para o site também abrir por file://.
   ───────────────────────────────────────────────────────────── */
(function(){
  'use strict';

  var arquivo = (location.pathname.split('/').pop() || 'index.html');
  if (arquivo === '') arquivo = 'index.html';
  var cats = (typeof SERVICOS === 'undefined' ? [] : SERVICOS);

  /* Páginas fixas. As categorias entram debaixo de "Catálogo",
     lidas de dados.js — acrescentar um serviço lá acrescenta aqui. */
  var PAGINAS = [
    { href:'index.html',    rot:'Início'   },
    { href:'catalogo',      rot:'Catálogo' },   /* abre a gaveta de categorias */
    { href:'projetos.html', rot:'Projetos' },
    /* área de quem já tem contrato: define ambiente por ambiente.
       Fica no menu para poder ser achada; quando houver login,
       sai daqui e passa a depender de sessão. */
    { href:'projeto.html',  rot:'Central'  },
    { href:'sobre.html',    rot:'Sobre'    },
    { href:'contato.html',  rot:'Contato'  }
  ];

  /* ── ícone ──────────────────────────────────────────────────
     Três réguas sobre papel, em SVG embutido — evita um binário e
     o 404 de /favicon.ico. As cores são as mesmas de :root; se os
     tokens mudarem, estas duas linhas mudam junto. */
  var ico = document.createElement('link');
  ico.rel = 'icon';
  ico.href = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' +
    '<rect width="32" height="32" fill="#faf8f5"/>' +
    '<g fill="#9c8b6e"><rect x="6" y="7" width="20" height="5"/>' +
    '<rect x="6" y="14" width="13" height="5"/>' +
    '<rect x="6" y="21" width="20" height="5"/></g></svg>');
  document.head.appendChild(ico);

  /* ── atalho de teclado ────────────────────────────────────── */
  var pular = document.createElement('a');
  pular.className = 'pular';
  pular.href = '#conteudo';
  pular.textContent = 'Pular para o conteúdo';
  document.body.insertBefore(pular, document.body.firstChild);
  var principal = document.querySelector('main');
  if (principal && !principal.id) principal.id = 'conteudo';

  /* ── cabeçalho ──────────────────────────────────────────────
     `data-hero` na <body> = há foto sangrando atrás; o cabeçalho
     nasce claro e só troca para papel depois que o hero sai. */
  var claro = document.body.hasAttribute('data-hero');
  var naHome = arquivo === 'index.html';
  var eCategoria = cats.some(function(s){ return s.slug + '.html' === arquivo; });

  var topo = document.createElement('header');
  topo.className = 'topo' + (claro ? ' claro' : '');
  /* As duas versões entram juntas e trocam por opacidade — ver a
     nota em site.css. `alt` só na escura para o leitor de tela não
     ouvir "Parket" duas vezes. */
  topo.innerHTML =
    '<a class="marca" href="index.html">' +
      '<img class="escuro" src="assets/logo-escuro.png" alt="Parket" decoding="async">' +
      '<img class="claro" src="assets/logo-claro.png" alt="" aria-hidden="true" decoding="async">' +
    '</a>' +
    '<nav class="menu" aria-label="Principal">' +
      PAGINAS.map(function(p){
        if (p.href === 'catalogo'){
          return '<button class="abre-cat" type="button" aria-expanded="false" aria-controls="gaveta-cat">' +
                 p.rot + '</button>';
        }
        var atual = p.href === arquivo || (naHome && p.href === 'index.html');
        return '<a href="' + p.href + '"' + (atual ? ' aria-current="page"' : '') + '>' + p.rot + '</a>';
      }).join('') +
    '</nav>' +
    '<button class="abre-menu" type="button" aria-expanded="false" aria-controls="gaveta" aria-label="Abrir menu">' +
      '<span></span><span></span>' +
    '</button>';
  document.body.insertBefore(topo, pular.nextSibling);

  if (eCategoria) topo.querySelector('.abre-cat').classList.add('ativo');

  /* ── gaveta de categorias (desktop) ─────────────────────────
     Painel que desce do cabeçalho com os nove pacotes. */
  var gavetaCat = document.createElement('div');
  gavetaCat.className = 'gaveta-cat';
  gavetaCat.id = 'gaveta-cat';
  gavetaCat.hidden = true;
  gavetaCat.innerHTML = '<div class="wrap">' +
    cats.map(function(s){
      return '<a href="' + s.slug + '.html"' +
        (s.slug + '.html' === arquivo ? ' aria-current="page"' : '') + '>' +
        '<span class="cat-nome">' + s.nome + '</span>' +
        '<span class="cat-qtd">' + String(s.itens).padStart(2,'0') + '</span></a>';
    }).join('') + '</div>';
  document.body.insertBefore(gavetaCat, topo.nextSibling);

  var botaoCat = topo.querySelector('.abre-cat');
  function abreCat(abrir){
    botaoCat.setAttribute('aria-expanded', String(abrir));
    gavetaCat.hidden = !abrir;
    requestAnimationFrame(function(){ gavetaCat.classList.toggle('on', abrir); });
  }
  botaoCat.addEventListener('click', function(){
    abreCat(botaoCat.getAttribute('aria-expanded') !== 'true');
  });
  document.addEventListener('click', function(e){
    if (!gavetaCat.hidden && !gavetaCat.contains(e.target) && e.target !== botaoCat) abreCat(false);
  });

  /* ── gaveta de menu (toque) ─────────────────────────────────
     Tudo em uma tela só: páginas em cima, categorias embaixo. */
  var gaveta = document.createElement('div');
  gaveta.className = 'gaveta';
  gaveta.id = 'gaveta';
  gaveta.hidden = true;
  gaveta.innerHTML =
    '<nav class="gaveta-int" aria-label="Menu">' +
      '<p class="kicker">Páginas</p>' +
      PAGINAS.filter(function(p){ return p.href !== 'catalogo'; }).map(function(p){
        return '<a class="g-pag" href="' + p.href + '"' +
          (p.href === arquivo ? ' aria-current="page"' : '') + '>' + p.rot + '</a>';
      }).join('') +
      '<p class="kicker">Catálogo</p>' +
      cats.map(function(s){
        return '<a class="g-cat" href="' + s.slug + '.html"' +
          (s.slug + '.html' === arquivo ? ' aria-current="page"' : '') + '>' +
          s.nome + '<em>' + String(s.itens).padStart(2,'0') + '</em></a>';
      }).join('') +
    '</nav>';
  document.body.insertBefore(gaveta, gavetaCat.nextSibling);

  var botaoMenu = topo.querySelector('.abre-menu');
  function abreMenu(abrir){
    botaoMenu.setAttribute('aria-expanded', String(abrir));
    botaoMenu.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('travado', abrir);
    if (abrir) gaveta.hidden = false;
    requestAnimationFrame(function(){ gaveta.classList.toggle('on', abrir); });
    if (!abrir) setTimeout(function(){ if (!gaveta.classList.contains('on')) gaveta.hidden = true; }, 400);
  }
  botaoMenu.addEventListener('click', function(){
    abreMenu(botaoMenu.getAttribute('aria-expanded') !== 'true');
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape'){ abreMenu(false); abreCat(false); }
  });

  /* Um sentinela no topo do documento diz quando o hero saiu —
     mais barato e mais estável que ouvir o evento de scroll. */
  var gatilho = document.createElement('div');
  gatilho.style.cssText = 'position:absolute;top:' + (claro ? '85svh' : '8px') + ';height:1px;width:1px';
  document.body.appendChild(gatilho);
  new IntersectionObserver(function(es){
    topo.classList.toggle('preso', !es[0].isIntersecting);
  }, {threshold:0}).observe(gatilho);

  /* ── rodapé ─────────────────────────────────────────────── */
  var alvo = document.querySelector('[data-rodape]');
  if (alvo){
    alvo.className = 'rodape wrap';
    alvo.innerHTML =
      '<div class="colunas">' +
        '<div>' +
          '<p class="frase">Madeira que vira legado.</p>' +
          '<p class="nota">Biblioteca visual de obra — o mesmo acervo que a obra usa para executar e o cliente usa para escolher.</p>' +
        '</div>' +
        '<div><h4>Catálogo</h4><ul>' +
          cats.map(function(s){
            return '<li><a href="' + s.slug + '.html">' + s.nome + '</a></li>';
          }).join('') +
        '</ul></div>' +
        '<div><h4>Parket</h4><ul>' +
          '<li><a href="index.html">Início</a></li>' +
          '<li><a href="projetos.html">Projetos</a></li>' +
          '<li><a href="sobre.html">Sobre</a></li>' +
          '<li><a href="contato.html">Contato</a></li>' +
        '</ul></div>' +
        '<div><h4>Contato</h4><ul>' +
          '<li><a href="mailto:contato@parket.com.br">contato@parket.com.br</a></li>' +
          '<li><a href="https://instagram.com/parket" rel="noopener">Instagram</a></li>' +
          '<li><span class="nota">São Paulo · SP</span></li>' +
        '</ul></div>' +
      '</div>' +
      '<div class="base">' +
        '<span>Parket · Biblioteca Visual de Obra</span>' +
        '<span>© ' + new Date().getFullYear() + '</span>' +
      '</div>';
  }

  /* ── app ────────────────────────────────────────────────────
     O service worker é o que deixa o site instalável e abrindo
     sem rede. Só existe sobre http(s) — por file:// é ignorado. */
  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0){
    addEventListener('load', function(){
      navigator.serviceWorker.register('sw.js').catch(function(){});
    });
  }
})();
