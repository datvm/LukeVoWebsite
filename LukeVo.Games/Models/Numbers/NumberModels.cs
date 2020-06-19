using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LukeVo.Games.Models.Numbers
{

    public class NumbersGameSession : DefaultGameSession
    {
        public const int Max = 100;

        Stack<int> RemainingNumbers { get; set; }
        public int CurrentNumber { get; set; } = -1;
        public bool[] FinishedNumber { get; set; } = new bool[Max];

        public NumbersGameSession(string id) : base(id)
        {
            this.InitializeStack();
        }

        public void Start()
        {
            this.LockAndWork(() =>
            {
                if (this.Started)
                {
                    return;
                }

                this.Started = true;
                this.Next();
            });
        }

        public void Next()
        {
            if (this.RemainingNumbers.Count == 0)
            {
                this.CurrentNumber = -1;
                this.Finished = true;
            }
            else
            {
                this.CurrentNumber = this.RemainingNumbers.Pop();
            }
        }

        public void Score(string name, int number)
        {
            this.LockAndWork(() =>
            {
                if (number != this.CurrentNumber)
                {
                    return;
                }

                this.Players[name].Score++;
                this.FinishedNumber[number] = true;
                this.Next();
            });
        }

        void InitializeStack()
        {
            var numbers = new int[Max];
            var random = new Random();

            for (int i = 0; i < Max; i++)
            {
                numbers[i] = i;
            }

            for (int i = 0; i < Max; i++)
            {
                var index = random.Next(Max);
                var temp = numbers[i];
                numbers[i] = numbers[index];
                numbers[index] = temp;
            }

            this.RemainingNumbers = new Stack<int>(numbers);
        }

    }

}
