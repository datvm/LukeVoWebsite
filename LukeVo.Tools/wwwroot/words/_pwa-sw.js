const v = "v=1";
const CacheName = "CacheV1";

self.addEventListener("install", (e) => {
    const urls = [
        "/words",
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css",
        "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css",
        `/_content/Common/css/common.min.css?${v}`,
        `/apps/words/css/words.min.css?${v}`,
        `/_content/Common/js/common.js?${v}`,
        `/apps/words/js/words.js?${v}`,
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/webfonts/fa-brands-400.woff2",
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/webfonts/fa-solid-900.woff2",
        `/Words/List`,
    ];

    e.waitUntil(
        caches.open(CacheName).then(cache => {
            return cache.addAll(urls);
        })
    );
});

self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches.match(e.request).then(r => {
            return r || fetch(e.request).then(response => {
                return caches.open(CacheName).then(cache => {
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    )
})