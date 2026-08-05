/* ─────────────────────────────────────────────────────────────
   Service worker — o que faz o site abrir como app e sem rede.

   Duas estratégias, escolhidas pelo que cada coisa é:

   · páginas (navegação) → rede primeiro, cache como rede reserva.
     O catálogo muda; ninguém quer ver preço e detalhe velhos por
     causa de um cache. Sem rede, devolve a cópia guardada, e se
     nem isso existir, a 404.

   · assets (css, js, imagem, fonte) → cache primeiro. São
     versionados pelo nome ou estáveis; buscar de novo só atrasa.

   · VOLATEIS → rede primeiro, mesmo sendo asset. A tabela de preços
     muda sem mudar de nome, e preço velho servido do cache é pior
     do que uma requisição a mais.

   Ao trocar VERSAO, todo cache anterior é apagado no activate.
   ───────────────────────────────────────────────────────────── */
var VERSAO = 'parket-v8';
var VOLATEIS = [/\/assets\/precos\.js$/];
var ESSENCIAL = [
  './',
  './index.html',
  './piso.html',
  './projeto.html',
  './contato.html',
  './404.html',
  './assets/site.css',
  './assets/paginacao.css',
  './assets/piso.css',
  './assets/site.js',
  './assets/dados.js',
  './assets/paginacao.js',
  './assets/categoria.js',
  './assets/secoes.js',
  './assets/projeto.css',
  './assets/projeto.js',
  './assets/ambientes.js',
  './assets/logo-escuro.png',
  './assets/logo-claro.png',
  './manifest.webmanifest'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(VERSAO)
      /* addAll falha inteiro se um item falhar — aqui cada um por si,
         para uma imagem ausente não derrubar a instalação */
      .then(function(c){
        return Promise.all(ESSENCIAL.map(function(u){
          return c.add(u).catch(function(){});
        }));
      })
      .then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(nomes){
      return Promise.all(nomes.map(function(n){
        return n === VERSAO ? null : caches.delete(n);
      }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  var req = e.request;
  if (req.method !== 'GET') return;

  var url = new URL(req.url);
  if (url.origin !== location.origin) return;      /* fontes do Google seguem direto */

  var volatil = VOLATEIS.some(function(re){ return re.test(url.pathname); });

  if (req.mode === 'navigate' || volatil){
    e.respondWith(
      fetch(req)
        .then(function(res){
          var copia = res.clone();
          caches.open(VERSAO).then(function(c){ c.put(req, copia); });
          return res;
        })
        .catch(function(){
          return caches.match(req).then(function(r){
            if (r) return r;
            /* sem rede e sem cópia: página cai na 404; asset volátil
               não tem página de erro, devolve falha mesmo */
            return volatil ? Response.error() : caches.match('./404.html');
          });
        })
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(function(r){
      return r || fetch(req).then(function(res){
        if (res.ok){
          var copia = res.clone();
          caches.open(VERSAO).then(function(c){ c.put(req, copia); });
        }
        return res;
      });
    })
  );
});
