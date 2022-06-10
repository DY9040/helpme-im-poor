const APP_PREFIX = 'helpme-im-poor-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    "./index.html",
    "./css/style.css",
    "./js/index.js"
];

self.addEventListener('fetch', function(e) {
    console.log('fetch request : ' + e.request.url)
    e.respondWith(
        caches.match(e.request).then(function(request) {
            if (request) {
                console.log('returning cached file : ' + e.request.url)
                return request
            } else {
                console.log('file is not cached, fetching : ' + e.request.url)
                return fetch(e.request)
            }
        })
    )
})

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            let cacheKeepList = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX) 
        });
        cacheKeepList.push(CACHE_NAME);
        return Promise.all(
            keyList.map(function (key, i) {
                if (cacheKeepList.indexOf(key) === -1) {
                    console.log('deleting cache : ' + keyList[i]);
                    return caches.delete(key[i]);
                }
            })
        );
    })
    );
});
