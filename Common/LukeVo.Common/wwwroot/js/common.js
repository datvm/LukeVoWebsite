class Language {

    static init() {
        let language = document.body.getAttribute("lang") || "en";

        document.querySelectorAll(".cbo-languages").forEach(el => {
            let opt = el.querySelector(`option[value='${language}']`);
            if (opt) {
                opt.selected = true;
            }

            el.addEventListener("change", () => {
                let code = el.value;
                window.location.href = "?language=" + code;
            });
        });
    }

    static getLanguageText(key) {
        let result = key;
        let el = document.querySelector(`[data-language-key]='${key}'`);
        
        if (el) {
            result = el.innerHTML;
        }

        return result;
    }

}

(() => {
    Language.init();
})();