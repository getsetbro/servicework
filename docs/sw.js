const cacheKey = "MyCacheName_v2";

self.addEventListener("install", (event) => {
  console.log("sw installing…");
  event.waitUntil(
    caches.open(cacheKey).then((cache) => {
      // Add all the assets in the array to the 'MyCacheName_v1'
      // `Cache` instance for later use.
      return cache.addAll([
        "./img/favicon.ico",
        "./css/style.css",
        "./img/cat.png",
        "./img/android-chrome-512x512.png",
      ]);
    })
  );
});

const expectedCaches = [cacheKey];

self.addEventListener("activate", (event) => {
  // delete any caches that aren't in expectedCaches
  // which will get rid of v1
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (!expectedCaches.includes(key)) {
              return caches.delete(key);
            }
          })
        )
      )
      .then(() => {
        console.log("V2 now ready to handle fetches!");
      })
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  // serve the cat SVG from the cache if the request is
  // same-origin and the path is '/dog.svg'
  if (url.origin == location.origin && url.pathname == "./img/dog.png") {
    event.respondWith(caches.match("./img/android-chrome-512x512.png"));
  }
});
