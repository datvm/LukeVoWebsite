String.prototype.toElement = function () {
    const template = document.createElement("template");
    template.innerHTML = this;
    return template.content.firstElementChild;
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