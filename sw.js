const CACHE_NAME = 'polar-brinque-v1';
  const urlsToCache = [
  '/APLICACOES-WEB/',
  '/APLICACOES-WEB/index.html',
  '/APLICACOES-WEB/manifest.json',
  '/APLICACOES-WEB/icon-192.png',
  '/APLICACOES-WEB/icon-512.png'
];
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://html2canvas.hertzen.com/dist/html2canvas.min.js',
  'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'
];

// Instalação: faz o cache dos recursos estáticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativação: limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Intercepta requisições: resposta do cache, se disponível, senão busca na rede
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se encontrou no cache, retorna
        if (response) {
          return response;
        }
        // Senão, busca na rede e armazena em cache (opcional)
        return fetch(event.request).then(
          networkResponse => {
            // Verifica se a resposta é válida
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            // Clona a resposta para poder armazenar no cache
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return networkResponse;
          }
        );
      })
  );
});