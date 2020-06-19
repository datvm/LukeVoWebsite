class NumbersLandingPage {

    initialize() {
        document.querySelector("#btn-join").addEventListener("click",
            () => this.joinAsync());
    }

    async joinAsync() {
        const id = document.querySelector("#txt-id").value;
        const name = document.querySelector("#txt-name").value;

        if (!id || !name) {
            return;
        }

        const r = await fetch(`/api/numbers/${encodeURI(id)}/join?name=${encodeURIComponent(name)}`);
        if (r.ok) {
            window.location.href = "/numbers/" + encodeURI(id) + "?name=" + encodeURIComponent(name);
        } else {
            alert("Someone already joined with that name.");
        }
    }

}
new NumbersLandingPage().initialize();