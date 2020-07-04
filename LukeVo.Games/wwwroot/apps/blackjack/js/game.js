const SuitText = ["Spades", "Clubs", "Diamonds", "Hearts"];

class BlackjackGamePage {

    btnStart = document.querySelector("#btn-start");
    lstPlayers = document.querySelector("#lst-players");
    cardTemplate = document.querySelector("#template-card").innerHTML;
    players = [];

    initialize() {
        const params = new URLSearchParams(window.location.search);
        this.name = params.get("name");

        this.id = document.querySelector("[data-id]").getAttribute("data-id");
        this.ide = encodeURI(this.id);

        window.setTimeout(() => this.updateGameAsync(), 100);

        this.btnStart.addEventListener("click", () => this.onStartButtonClick());
        document.body.addDelegate("click", "button[data-action]",
            (e, target) => this.onActionButtonClick(target));
    }

    async onActionButtonClick(btn) {
        const action = btn.getAttribute("data-action");

        const url = `/api/blackjack/${this.ide}/${action}?player=${this.index}`;
        await fetch(url);
    }

    async updateGameAsync() {
        try {
            const r = this.game = await fetch(`/api/blackjack/${this.ide}`)
                .then(r => r.json());

            this.btnStart.classList.toggle("invisible", r.started);
            this.lstPlayers.classList.toggle("reveal", r.isRevealing);

            for (let key in r.players) {
                const player = r.players[key];
                const i = player.index;

                let playerEl = this.players[i];

                if (!playerEl) {
                    const template = document.querySelector("#template-player").innerHTML;
                    const el = template.toElement();
                    el.querySelector(".name").innerHTML = player.name;

                    if (this.name == player.name) {
                        this.index = player.index;
                        el.classList.add("playing");
                    }

                    this.lstPlayers.appendChild(el);
                    playerEl = this.players[i] = el;
                }

                const isPlaying = this.index == i;
                playerEl.querySelector(".score").innerHTML = player.score;
                playerEl.querySelector(".turn").classList.toggle("invisible", i != r.playerTurn);

                const cardFrag = new DocumentFragment();
                if (r.playerCards && r.playerCards[i]) {
                    for (let card of r.playerCards[i]) {
                        const cardEl = this.cardTemplate.toElement();
                        cardEl.style.backgroundImage = `url(${this.getCardUrl(card)})`;

                        if (isPlaying) {
                            cardEl.classList.add("reveal");
                        }

                        cardFrag.appendChild(cardEl);
                    }
                }

                const cards = playerEl.querySelector(".card-container");
                cards.innerHTML = "";
                cards.appendChild(cardFrag);

                if (r.isRevealing) {
                    playerEl.querySelector(".hand-count").innerHTML = r.revealingResult[i].count;
                }
            }
        } catch (e) {
            console.error(e);
        }

        window.setTimeout(() => this.updateGameAsync(), 1000);
    }

    async onStartButtonClick() {
        this.btnStart.classList.add("d-none");
        await fetch(`/api/blackjack/${this.ide}/start`);
    }

    getCardUrl(card) {
        return `/img/cards/card${SuitText[card.suit]}${card.num}.png`;
    }

}
new BlackjackGamePage().initialize();