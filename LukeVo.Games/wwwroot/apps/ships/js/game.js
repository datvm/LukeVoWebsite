class ShipsGamePage {

    btnStart = document.querySelector("#btn-start");
    lblCurrentNumber = document.querySelector("#lbl-current");

    lblPlayerNames = document.querySelectorAll("[data-pname]");
    lblPlayerTurns = document.querySelectorAll("[data-pturn]");

    urlShip = document.querySelector("#lnk-ship").href;
    urlFire = document.querySelector("#lnk-fire").href;
    urlCross = document.querySelector("#lnk-cross").href;

    initialize() {
        const params = new URLSearchParams(window.location.search);
        this.name = params.get("name");
        this.ownerIndex = -1;

        this.id = document.querySelector("[data-id]").getAttribute("data-id");
        this.ide = encodeURI(this.id);

        this.btnStart.addEventListener("click", () => this.onStartButtonClick());

        window.setTimeout(() => {
            this.updateGameAsync();
        }, 1000);
    }

    async onCellClick(el) {
        const x = el.x;
        const y = el.y;
        if (!this.game || this.game.currentPlayerTurn != this.ownerIndex) {
            return;
        }

        const params = new URLSearchParams();
        params.append("name", this.name);
        params.append("x", x);
        params.append("y", y);

        await fetch(`/api/ships/${this.ide}/fire?${params.toString()}`);
    }

    async updateGameAsync() {
        try {
            const r = this.game = await fetch(`/api/ships/${this.ide}`)
                .then(r => r.json());

            if (r.started) {
                this.btnStart.classList.add("d-none");

                if (!this.boards) {
                    this.generateBoards();
                }
            }

            this.lblPlayerTurns.forEach(el => el.classList.add("d-none"));
            for (const name in r.players) {
                const p = r.players[name];
                const index = p.index;
                this.lblPlayerNames[index].innerHTML = p.name;

                if (r.started) {
                    if (r.currentPlayerTurn == index) {
                        this.lblPlayerTurns[index].classList.remove("d-none");
                    }

                    const board = r.boards[index];
                    const boardEl = this.boards[index];

                    for (let x = 0; x < board.length; x++) {
                        const col = board[x];
                        const colEl = boardEl[x];

                        for (let y = 0; y < col.length; y++) {
                            const cell = col[y];
                            const cellEl = colEl[y];

                            if (cell.fired) {
                                if (cell.hit) {
                                    cellEl.classList.add("fire");
                                } else {
                                    cellEl.classList.add("miss");
                                }
                            }
                        }
                    }
                }
            }

            if (r.finished) {
                document.querySelector("#lbl-finished").classList.remove("d-none");
            }
        } catch (e) {
            console.error(e);
        }

        window.setTimeout(() => this.updateGameAsync(), 100);
    }

    async onStartButtonClick() {
        this.btnStart.classList.add("d-none");
        await fetch(`/api/ships/${this.ide}/start`);
    }

    generateBoards() {
        const g = this.game;
        this.boards = [];

        for (let name in g.players) {
            const index = g.players[name].index;

            if (this.ownerIndex == -1 && name == this.name) {
                this.ownerIndex = index;
            }

            this.boards[index] = this.generateBoard(index);
        }
    }

    generateBoard(index) {
        const el = document.querySelector(`[data-board="${index}"]`);
        el.innerHTML = "";

        const board = this.game.boards[index];

        const size = Math.min(
            Math.floor(el.clientWidth / board[0].length),
            Math.floor(el.clientHeight / board.length));

        const boardEl = document.createElement("div");
        boardEl.classList.add("game-board");

        const result = [];

        for (let x = 0; x < board.length; x++) {
            const col = board[x];

            const resultCol = [];
            result.push(resultCol);

            const colEl = document.createElement("div");
            colEl.classList.add("board-col");
            colEl.x = x;

            for (let y = 0; y < col.length; y++) {
                const cell = col[y];

                const cellEl = document.createElement("div");
                cellEl.classList.add("cell");
                cellEl.x = x;
                cellEl.y = y;
                cellEl.style.width = cellEl.style.height = `${size}px`;

                this.appendImage(cellEl, this.urlCross, "icon-cross");
                this.appendImage(cellEl, this.urlShip, "icon-ship");
                this.appendImage(cellEl, this.urlFire, "icon-fire");

                if (cell.hasShip) {
                    cellEl.classList.add("has-ship");
                }

                if (this.ownerIndex != index) {
                    cellEl.addEventListener("click", () => this.onCellClick(cellEl));
                }

                colEl.appendChild(cellEl);
                resultCol.push(cellEl);
            }

            boardEl.appendChild(colEl);
        }

        if (this.ownerIndex == index) {
            boardEl.classList.add("owner");
        }

        el.appendChild(boardEl);
        return result;
    }

    appendImage(el, url, name) {
        const img = document.createElement("div");
        img.classList.add("icon", name);
        img.style.backgroundImage = `url("${url}")`;

        el.appendChild(img);
    }

}
new ShipsGamePage().initialize();