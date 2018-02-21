"use strict";
(function() {
    var cacheVersion = "-170816";
    var staticImageCacheName = "image" + cacheVersion;
    var staticAssetsCacheName = "assets" + cacheVersion;
    var contentCacheName = "content" + cacheVersion;
    var vendorCacheName = "vendor" + cacheVersion;
    var maxEntries = 100;
    self.importScripts("https://s.nfz.yecdn.com/static/js/sw-t.js");
    self.toolbox.options.debug = false;
    self.toolbox.options.networkTimeoutSeconds = 5;

    /* staticImageCache */
    self.toolbox.router.get("/img/(.*)", self.toolbox.cacheFirst, {
        origin: /blog\.nfz\.yecdn\.com/,
        cache: {
            name: staticImageCacheName,
            maxEntries: maxEntries
        }
    });
    self.toolbox.router.get("/img/(.*)", self.toolbox.cacheFirst, {
        origin: /bbs-static\.nfz\.yecdn\.com/,
        cache: {
            name: staticImageCacheName,
            maxEntries: maxEntries
        }
    });
    self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
        origin: /p0\.ssl\.qhmsg\.com/,
        cache: {
            name: staticImageCacheName,
            maxEntries: maxEntries
        }
    });
    self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
        origin: /img1\.nfz\.yecdn\.com/,
        cache: {
            name: staticImageCacheName,
            maxEntries: maxEntries
        }
    });
    self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
        origin: /img2\.nfz\.yecdn\.com/,
        cache: {
            name: staticImageCacheName,
            maxEntries: maxEntries
        }
    });
    self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
        origin: /i\.nfz\.yecdn\.com/,
        cache: {
            name: staticImageCacheName,
            maxEntries: maxEntries
        }
    });
    self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
        origin: /ooo\.0o0\.ooo/,
        cache: {
            name: staticImageCacheName,
            maxEntries: maxEntries
        }
    });
    self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
        origin: /i\.loli\.net/,
        cache: {
            name: staticImageCacheName,
            maxEntries: maxEntries
        }
    });

    /* StaticAssetsCache */
    self.toolbox.router.get("/css/(.*)", self.toolbox.networkFirst, {origin: /blog\.nfz\.yecdn\.com/,});
    self.toolbox.router.get("/js/(.*)", self.toolbox.networkFirst, {origin: /blog\.nfz\.yecdn\.com/,});
    self.toolbox.router.get("/static/(.*)", self.toolbox.networkFirst, {
        origin: /blog\.nfz\.yecdn\.com/,
        cache: {
            name: staticAssetsCacheName,
            maxEntries: maxEntries
        }
    });
    self.toolbox.router.get("/fonts/(.*)", self.toolbox.cacheFirst, {
        origin: /blog\.nfz\.yecdn\.com/,
        cache: {
            name: staticAssetsCacheName,
            maxEntries: maxEntries
        }
    });
    self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
        origin: /cdnjs\.cat\.net/,
        cache: {
            name: staticAssetsCacheName,
            maxEntries: maxEntries
        }
    });

    /* ContentCache */
    self.toolbox.router.get("/archives/(.*).html(.*)", self.toolbox.networkFirst, {
        cache: {
            name: contentCacheName,
            maxEntries: maxEntries
        }
    });
    self.toolbox.router.get("/(tags|about|gallery|archives|links|timeline)(.*)", self.toolbox.networkFirst, {
        cache: {
            name: contentCacheName,
            maxEntries: maxEntries
        }
    });
    self.toolbox.router.get("/$", self.toolbox.networkFirst, {
        cache: {
            name: contentCacheName,
            maxEntries: maxEntries
        }
    });
    self.toolbox.router.get("/\?(.*)$", self.toolbox.networkFirst, {
        cache: {
            name: contentCacheName,
            maxEntries: maxEntries
        }
    });
    self.toolbox.router.get("/", self.toolbox.networkFirst, {
        cache: {
            name: contentCacheName,
            maxEntries: maxEntries
        }
    });

    /* VendorCache */
    self.toolbox.router.get("/next/config.json", self.toolbox.networkOnly, {origin: /disqus\.com/,});
    self.toolbox.router.get("/api/(.*)", self.toolbox.networkOnly, {origin: /disqus\.com/,});
    self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
        origin: /a\.disquscdn\.com/,
        cache: {
            name: vendorCacheName,
            maxEntries: maxEntries
        }
    });
    self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
        origin: /c\.disquscdn\.com/,
        cache: {
            name: vendorCacheName,
            maxEntries: maxEntries
        }
    });
    self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
        origin: /uploads\.disquscdn\.com/,
        cache: {
            name: vendorCacheName,
            maxEntries: maxEntries
        }
    });
    self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
        origin: /media\.disquscdn\.com/,
        cache: {
            name: vendorCacheName,
            maxEntries: maxEntries
        }
    });
    self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
        origin: /referrer\.disqus\.com/,
        cache: {
            name: vendorCacheName,
            maxEntries: maxEntries
        }
    });
    self.toolbox.router.get("/(.*)", self.toolbox.networkOnly, {origin: /(www\.google-analytics\.com|ssl\.google-analytics\.com)/,
        cache: {
            name: vendorCacheName,
            maxEntries: maxEntries
        }
    });

    /* NoCache */
    self.toolbox.router.get("/sw.js", self.toolbox.networkFirst),
    self.toolbox.router.get("/(.*).php(.*)", self.toolbox.networkOnly),
	self.toolbox.router.get("/(.*)", self.toolbox.networkOnly, {origin: /ga\.fir\.im/,});
    self.toolbox.router.get("/(.*)", self.toolbox.networkOnly, {origin: /ga\.yecdn\.com/,});
    self.toolbox.router.get("/(.*)", self.toolbox.networkOnly, {origin: /api\.nfz\.moe/,});

    self.addEventListener("install",
        function(event) {return event.waitUntil(self.skipWaiting())
        });
    self.addEventListener("activate",
        function(event) {return event.waitUntil(self.clients.claim())
        })
})();