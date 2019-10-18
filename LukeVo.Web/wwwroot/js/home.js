class HomePage {

    static HrefReplaces = {
        "showcase": "https://tools.lukevo.com/",
        "netcore": "https://dotnet.microsoft.com/download/dotnet-core",
        "github": "https://github.com/datvm",
        "restsharp": "https://github.com/restsharp/RestSharp",
        "shopifysharp": "https://github.com/nozzlegear/ShopifySharp",
        "upwork": "https://www.upwork.com/o/profiles/users/_~01604feebad76541a5/",
    };

    init() {
        document.querySelectorAll("[data-href]").forEach(el => {
            el.href = HomePage.HrefReplaces[el.getAttribute("data-href")];
        });
    }

}

(() => {
    let page = window.page = new HomePage();
    page.init();
})();
