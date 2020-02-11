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
        let el = document.querySelector(`[data-language-key='${key}']`);
        
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

String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
    function () {
        "use strict";
        var str = this.toString();
        if (arguments.length) {
            var t = typeof arguments[0];
            var key;
            var args = ("string" === t || "number" === t) ?
                Array.prototype.slice.call(arguments)
                : arguments[0];

            for (key in args) {
                str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
            }
        }

        return str;
    };

(() => {
    Language.init();
})();