class WordTree {

    constructor(words) {
        this.root = {};

        if (words) {
            for (let word of words) {
                this.addWord(word);
            }
        }
    }

    addWord(word) {
        word = word.toLowerCase();
        let curr = this.root;

        for (let c of word) {
            let next = curr[c];

            if (!next) {
                next = curr[c] = {};
            }

            curr = next;
        }

        curr["|"] = true;
    }

    list(letters) {
        const result = [];
        const counter = {};

        for (let c of letters) {
            counter[c] = (counter[c] || 0) + 1;
        }

        this._try(result, "", counter, Object.keys(counter), this.root);

        result.sort((a, b) => {
            if (a.length == b.length) {
                return a.localeCompare(b);
            } else {
                return a.length - b.length;
            }
        });
        return result;
    }

    _try(result, text, counter, letters, branch) {
        for (let c of letters) {
            if (!counter[c]) {
                continue;
            }

            const nextBranch = branch[c];
            if (!nextBranch) {
                continue;
            }

            counter[c]--;
            const nextText = text + c;
            if (nextText.length > 1 && nextBranch["|"]) {
                result.push(nextText);
            }
            this._try(result, nextText, counter, letters, nextBranch);

            counter[c]++;
        }
    }

}

class WordsLookup {

    async initialize() {
        this.loadingPromise = this.loadDataAsync();

        document.querySelector("#frm-input").addEventListener("submit",
            () => this.onFormSubmit());

        window.addEventListener("beforeinstallprompt",
            () => this.onBeforeInstallPrompt());

        await this.loadingPromise;
    }

    onBeforeInstallPrompt() { }

    async loadDataAsync() {
        const rawText = await fetch("/Words/List")
            .then(r => r.text());

        this.words = rawText.split(/\n/g);
        this.wordTree = new WordTree(this.words);

        document.querySelector("#loader").classList.add("d-none");
        document.querySelector("#pnl-result").classList.remove("d-none");
    }

    onFormSubmit() {
        event.preventDefault();

        (async () => {
            await this.loadingPromise;

            const input = document.querySelector("#txt-letters").value.toLowerCase();
            const chars = [];

            for (let c of input) {
                const code = c.charCodeAt(0);
                if (code >= 97 && code <= 122) {
                    chars.push(c);
                }
            }

            const list = this.wordTree.list(chars);
            this.showList(list);
        })();
    }

    showList(list) {
        const lst = document.querySelector("#lst-result");
        lst.innerHTML = "";

        if (!list.length) {
            return;
        }

        const frag = new DocumentFragment();

        let currDiv = document.createElement("div");
        frag.appendChild(currDiv);
        var currLength = list[0].length;

        for (let word of list) {
            if (word.length != currLength) {
                currLength = word.length;
                currDiv = document.createElement("div");
                frag.appendChild(currDiv);
            }

            const el = document.createElement("span");
            el.innerHTML = word;

            currDiv.appendChild(el);
        }

        lst.appendChild(frag);
    }

}

new WordsLookup().initialize();