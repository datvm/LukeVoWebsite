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

HTMLElement.prototype.addDelegate = function (eventName, cssMatch, callback) {
    this.addEventListener(eventName, function (e) {
        for (let target = e.target; target && target != this; target = target.parentNode) {
            if (target.matches(cssMatch)) {
                callback(e, target);

                break;
            }
        }
    });
};

(() => {
    Language.init();
})();