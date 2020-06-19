using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LukeVo.Games.Models.Board
{

    public class BoardGameSession : DefaultGameSession
    {

        public const int Width = 10;
        public const int Height = 10;

        public int CurrentNumber { get; set; } = -1;
        public BoardCell[][] Board { get; set; }

        public BoardGameSession(string id) : base(id)
        {
            this.Initialize();
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

        public void Click(string name, int x, int y)
        {
            this.LockAndWork(() =>
            {
                var cell = this.Board[x][y];
                if (cell.Value != this.CurrentNumber)
                {
                    return;
                }

                var player = this.Players[name];
                cell.Player = player.Index;
                player.Score++;

                if (this.CurrentNumber >= 80)
                {
                    player.Score++;
                }

                if (this.CurrentNumber >= 95)
                {
                    player.Score++;
                }

                this.Next();
            });
        }

        void Next()
        {
            this.CurrentNumber++;

            if (this.CurrentNumber == Width * Height)
            {
                this.CurrentNumber = -1;
                this.Finished = true;
            }
        }

        void Initialize()
        {
            var values = new int[Width * Height];
            for (int i = 0; i < values.Length; i++)
            {
                values[i] = i;
            }

            var random = new Random();
            for (int i = 0; i < values.Length; i++)
            {
                var index = random.Next(values.Length);
                var temp = values[index];
                values[index] = values[i];
                values[i] = temp;
            }

            this.Board = new BoardCell[Width][];
            for (int x = 0; x < Width; x++)
            {
                var col = this.Board[x] = new BoardCell[Height];

                for (int y = 0; y < Height; y++)
                {
                    col[y] = new BoardCell()
                    {
                        Value = values[x * Height + y],
                    };
                }
            }
        }

        public class BoardCell
        {
            public int? Player { get; set; }
            public int Value { get; set; }
        }

    }

}
