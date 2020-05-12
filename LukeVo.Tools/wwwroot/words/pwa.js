(async function () {
    if (navigator.serviceWorker) {
        const reg = await navigator.serviceWorker.register("/words/pwa-sw.js?v=1", {
            scope: "/words",
        });
    }
})();