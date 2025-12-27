const CACHE_VERSION = 'v1'
const STATIC_CACHE = `static-${CACHE_VERSION}`
const AUDIO_CACHE = `audio-${CACHE_VERSION}`
const FONTS_CACHE = `font-${CACHE_VERSION}`

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/favicon.ico',
    'logo.png',
    '/manifest.json',
]

// INSTALL
self.addEventListener('install', (event) => {
    self.skipWaiting()
    event.waitUntil(
        Promise.all([
            caches
                .open(STATIC_CACHE)
                .then((cache) => cache.addAll(STATIC_ASSETS)),
            caches.open(AUDIO_CACHE),
            caches.open(FONTS_CACHE),
        ]),
    )
})

// ACTIVATE
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => {
                    if (
                        ![STATIC_CACHE, AUDIO_CACHE, FONTS_CACHE].includes(key)
                    ) {
                        return caches.delete(key)
                    }
                }),
            ),
        ),
    )
    self.clients.claim()
})

// FETCH
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return

    const requestURL = new URL(event.request.url)

    if (requestURL.pathname.startsWith('/fonts/')) {
        event.respondWith(
            caches.open(FONTS_CACHE).then((cache) =>
                cache.match(event.request).then((cached) => {
                    if (cached) {
                        return cached
                    }
                    return fetch(event.request).then((response) => {
                        if (response && response.status === 200) {
                            cache.put(event.request, response.clone())
                        }
                        return response
                    })
                }),
            ),
        )
        return
    }

    // 🎵 AUDIO: cache-first
    if (requestURL.pathname.startsWith('/audio/')) {
        event.respondWith(
            caches.open(AUDIO_CACHE).then((cache) =>
                cache.match(event.request).then((cached) => {
                    if (cached) {
                        return cached
                    }
                    return fetch(event.request).then((response) => {
                        if (response && response.status === 200) {
                            cache.put(event.request, response.clone())
                        }
                        return response
                    })
                }),
            ),
        )
        return
    }

    // 🧭 NAVIGATION: network-first
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    const responseClone = response.clone()
                    caches.open(STATIC_CACHE).then((cache) => {
                        cache.put('/index.html', responseClone)
                    })
                    return response
                })
                .catch(() => caches.match('/index.html')),
        )
        return
    }

    // 📦 OTHER ASSETS: cache-first fallback
    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) {
                return cached
            }
            return fetch(event.request).then((response) => {
                if (
                    response &&
                    response.status === 200 &&
                    requestURL.origin === self.location.origin
                ) {
                    caches.open(STATIC_CACHE).then((cache) => {
                        cache.put(event.request, response.clone())
                    })
                }
                return response
            })
        }),
    )
})
