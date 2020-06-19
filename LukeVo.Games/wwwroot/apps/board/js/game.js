class BoardGamePage {

    lstPlayers = document.querySelector("#lst-players");
    btnStart = document.querySelector("#btn-start");
    lblCurrentNumber = document.querySelector("#lbl-current");

    initialize() {
        const params = new URLSearchParams(window.location.search);
        this.name = params.get("name");

        this.id = document.querySelector("[data-id]").getAttribute("data-id");
        this.ide = encodeURI(this.id);

        window.setTimeout(() => this.updateGameAsync(), 1000);

        this.btnStart.addEventListener("click", () => this.onStartButtonClick());
    }

    async onNumberClick(el) {
        const number = el.number;
        const x = el.x;
        const y = el.y;
        if (!this.game || this.game.currentNumber != number) {
            return;
        }

        const params = new URLSearchParams();
        params.append("name", this.name);
        params.append("x", x);
        params.append("y", y);

        await fetch(`/api/board/${this.ide}/click?${params.toString()}`);
    }

    async updateGameAsync() {
        try {
            const r = this.game = await fetch(`/api/board/${this.ide}`)
                .then(r => r.json());

            this.lstPlayers.innerHTML = "";
            for (let name in r.players) {
                const p = r.players[name];
                const el = document.createElement("p");
                el.innerHTML = `${p.name}: ${p.score}`;

                this.lstPlayers.appendChild(el);
            }

            if (!this.board && r.started) {
                this.generateBoard();
            }

            if (r.started) {
                
                if (r.finished) {
                    this.lblCurrentNumber.innerHTML = "Finished!";
                } else {
                    this.lblCurrentNumber.innerHTML = r.currentNumber;
                }

                this.lblCurrentNumber.classList.remove("d-none");
                this.btnStart.classList.add("d-none");

                const data = r.board;
                for (let x = 0; x < data.length; x++) {
                    const row = this.board[x];
                    const rowData = data[x];

                    for (let y = 0; y < rowData.length; y++) {
                        const cell = row[y];
                        const cellData = rowData[y];

                        if (cellData.player != null) {
                            cell.classList.add("done-" + cellData.player);
                        }
                    }
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
        await fetch(`/api/board/${this.ide}/start`);
    }

    generateBoard() {
        const data = this.game.board;
        this.board = [];

        const tableEl = document.querySelector("#board");
        tableEl.innerHTML = "";

        const maxHeight = document.querySelector(".game-board").clientHeight;
        const cellSize = Math.floor(Math.min(
            tableEl.clientWidth / data.length,
            maxHeight / data[0].length,
        ));

        const frag = new DocumentFragment();
        for (let x = 0; x < data.length; x++) {
            const row = [];
            this.board.push(row);

            const rowData = data[x];

            const rowEl = document.createElement("tr");

            for (let y = 0; y < rowData.length; y++) {
                const cellData = rowData[y];

                const cellEl = document.createElement("td");
                cellEl.innerHTML = cellEl.number = cellData.value;
                cellEl.style.width = cellEl.style.height = `${cellSize}px`;

                row.push(cellEl);
                rowEl.appendChild(cellEl);

                cellEl.x = x;
                cellEl.y = y;
                cellEl.addEventListener("click", () => this.onNumberClick(cellEl));
            }

            frag.appendChild(rowEl);
        }

        tableEl.appendChild(frag);
    }

}
new BoardGamePage().initialize();