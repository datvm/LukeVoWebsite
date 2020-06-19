class NumbersGamePage {

    lstPlayers = document.querySelector("#lst-players");
    btnStart = document.querySelector("#btn-start");
    lblCurrentNumber = document.querySelector("#lbl-current");
    board = document.querySelector("#board");

    initialize() {
        const params = new URLSearchParams(window.location.search);
        this.name = params.get("name");

        this.id = document.querySelector("[data-id]").getAttribute("data-id");
        this.ide = encodeURI(this.id);

        this.updateGameAsync();

        this.btnStart.addEventListener("click", () => this.onStartButtonClick());

        window.setTimeout(() => {
            this.generateBoard();
        }, 1000);
    }

    async onNumberClick(el) {
        const number = el.number;
        if (!this.game || this.game.currentNumber != number) {
            return;
        }

        const params = new URLSearchParams();
        params.append("name", this.name);
        params.append("number", number);

        await fetch(`/api/numbers/${this.ide}/score?${params.toString()}`);
    }

    async updateGameAsync() {
        try {
            const r = this.game = await fetch(`/api/numbers/${this.ide}`)
                .then(r => r.json());

            this.lstPlayers.innerHTML = "";
            for (let name in r.players) {
                const p = r.players[name];
                const el = document.createElement("p");
                el.innerHTML = `${p.name}: ${p.score}`;

                this.lstPlayers.appendChild(el);
            }

            if (r.started) {
                this.lblCurrentNumber.innerHTML = r.currentNumber;
                this.lblCurrentNumber.classList.remove("d-none");
                this.btnStart.classList.add("d-none");

                for (var i = 0; i < 100; i++) {
                    this.numbers[i].classList.toggle("done", r.finishedNumber[i]);
                }
            } else {
                this.lblCurrentNumber.classList.add("d-none");
                this.btnStart.classList.remove("d-none");
            }
        } catch (e) {
            console.error(e);
        }
        
        window.setTimeout(() => this.updateGameAsync(), 100);
    }

    async onStartButtonClick() {
        this.btnStart.classList.add("d-none");
        await fetch(`/api/numbers/${this.ide}/start`);
    }

    generateBoard() {
        this.board.innerHTML = "";

        const size = this.board.getBoundingClientRect();
        const w = size.width - 80;
        const h = size.height - 80;

        const positions = [];
        this.numbers = [];

        for (var i = 0; i < 100; i++) {
            const el = document.createElement("span");
            el.classList.add("number");
            el.innerHTML = i;

            let posValid;
            do {
                posValid = true;
                const x = Math.floor(Math.random() * w) + 20;
                const y = Math.floor(Math.random() * h) + 20;

                el.style.left = `${x}px`;
                el.style.top = `${y}px`;
                el.number = i;

                for (let pos of positions) {
                    if (Math.abs(x - pos.x) < 20 && Math.abs(y - pos.y) < 20) {
                        posValid = false;
                        break;
                    }
                }

                if (posValid) {
                    positions.push({
                        x: x,
                        y: y,
                    });
                }
            } while (!posValid);

            el.addEventListener("click", () => this.onNumberClick(el));

            this.board.appendChild(el);
            this.numbers.push(el);
        }
    }

}
new NumbersGamePage().initialize();