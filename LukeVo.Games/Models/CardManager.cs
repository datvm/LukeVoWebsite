using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LukeVo.Games.Models
{

    public class CardManager
    {

        public Stack<Card> Cards { get; private set; }

        public void Add(int deck, bool shuffleAfterAdd)
        {
            for (int i = 0; i < deck; i++)
            {
                for (int num = 0; num < 14; num++)
                {
                    for (int suit = 0; suit < 4; suit++)
                    {
                        this.Cards.Push(new Card(num, suit));
                    }
                }
            }

            if (shuffleAfterAdd)
            {
                this.Shuffle();
            }
        }

        public void Add(Card card)
        {
            this.Cards.Push(card);
        }

        public Card Deal()
        {
            if (this.Cards.Count > 0)
            {
                return this.Cards.Pop();
            }
            else
            {
                return null;
            }
        }

        public void Shuffle()
        {
            var stack = this.Cards;
            var cards = new List<Card>();
            while (stack.Count > 0)
            {
                cards.Add(stack.Pop());
            }

            var random = new Random();
            for (int i = 0; i < cards.Count; i++)
            {
                var index = random.Next(cards.Count);
                var temp = cards[i];
                cards[i] = cards[index];
                cards[index] = temp;
            }

            foreach (var card in cards)
            {
                stack.Push(card);
            }
        }

        public void Clear()
        {
            this.Cards.Clear();
        }

    }

    public class Card
    {
        public Card(int num, int suit)
        {
            this.Num = num;
            this.Suit = suit;
        }

        public int Num { get; set; }
        public int Suit { get; set; }

    }

}
