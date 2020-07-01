using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LukeVo.Games.Models.Blackjack
{
    public class BlackjackGameSession : DefaultGameSession
    {

        public CardManager Cards { get; private set; } = new CardManager();

        public List<Card>[] PlayerCards { get; private set; }
        public int PlayerTurn { get; private set; }
        public int Round { get; private set; }

        public bool IsRevealing { get; private set; }
        public List<HandResult> RevealingResult { get; private set; }

        public BlackjackGameSession(string id) : base(id)
        {
            this.Cards.Add(1, true);
        }

        public void Start()
        {
            this.LockAndWork(() =>
            {
                if (this.Started)
                {
                    return;
                }

                this.PlayerCards = new List<Card>[this.Players.Count];
                this.Round = 0;

                this.StartRound();

                this.Started = true;
            });
        }

        public void Deal(int player)
        {
            this.LockAndWork(() =>
            {
                if (player != this.PlayerTurn)
                {
                    return;
                }

                var playerCards = this.PlayerCards[player];
                playerCards.Add(this.Cards.Deal());

                var hand = this.CountHand(playerCards);
                if (hand.Count >= 21)
                {
                    this.NextPlayer();
                }
            });
        }

        public void Lock(int player)
        {
            this.LockAndWork(() =>
            {
                if (player != this.PlayerTurn)
                {
                    return;
                }

                this.NextPlayer();
            });
        }

        public async void NextPlayer()
        {
            this.PlayerTurn++;

            if (this.PlayerTurn >= this.Players.Count)
            {
                var result = this.RevealingResult = this.PlayerCards
                    .Select(q => this.CountHand(q))
                    .ToList();

                if (result.Any(q => q.Blackjack))
                {
                    for (int i = 0; i < result.Count; i++)
                    {
                        if (result[i].Blackjack)
                        {
                            this.GetPlayer(i).Score++;
                        }
                    }
                }
                else
                {
                    var validList = result
                        .Where(q => q.Count < 22)
                        .ToList();

                    if (validList.Count > 0)
                    {
                        var max = validList
                            .Max(q => q.Count);

                        for (int i = 0; i < result.Count; i++)
                        {
                            if (result[i].Count == max)
                            {
                                this.GetPlayer(i).Score++;
                            }
                        }
                    }
                }

                this.IsRevealing = true;

                await Task.Delay(5000);
                this.IsRevealing = false;
            }
        }

        public void StartRound()
        {
            this.Round++;

            this.PlayerCards = new List<Card>[this.Players.Count];
            this.Cards.Clear();
            this.Cards.Add(1, true);

            foreach (var player in this.PlayerCards)
            {
                for (int i = 0; i < 2; i++)
                {
                    player.Add(this.Cards.Deal());
                    player.Add(this.Cards.Deal());
                }
            }

            this.PlayerTurn = 0;
        }

        public HandResult CountHand(List<Card> cards)
        {
            var total = 0;
            var aceCount = 0;

            foreach (var card in cards)
            {
                if (card.Num == 1)
                {
                    total += 10;
                    aceCount += 9;
                }
                else if (card.Num > 10)
                {
                    total += 10;
                }
                else
                {
                    total += card.Num;
                }

                if (total > 21 && aceCount > 0)
                {
                    total -= 9;
                    aceCount -= 9;
                }
            }

            return new HandResult()
            {
                Count = total,
                Blackjack = total == 21 && cards.Count == 2,
            };
        }

        public class HandResult
        {
            public int Count { get; set; }
            public bool Blackjack { get; set; }
        }
    }
}
