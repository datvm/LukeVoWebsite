using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LukeVo.Games.Models.Ships
{

    public class ShipsGameSession : DefaultGameSession
    {
        const int Width = 10;
        const int Height = 10;

        static readonly int[] ShipSizes = { 1, 2, 2, 3, 3, 4 };

        public BoardCell[][][] Boards { get; set; }
        public int CurrentPlayerTurn { get; set; }

        public ShipsGameSession(string id) : base(id) { }

        public void Start()
        {
            this.LockAndWork(() =>
            {
                if (this.Started)
                {
                    return;
                }

                var random = new Random();
                this.Boards = new BoardCell[this.Players.Count][][];
                foreach (var player in this.Players)
                {
                    var board = this.Boards[player.Value.Index] = new BoardCell[Width][];

                    for (int x = 0; x < Width; x++)
                    {
                        var col = board[x] = new BoardCell[Height];

                        for (int y = 0; y < Height; y++)
                        {
                            col[y] = new BoardCell();
                        }
                    }

                    foreach (var size in ShipSizes)
                    {
                        var horizontal = random.Next(2) == 0;

                        var maxX = Width - (horizontal ? size : 1);
                        var maxY = Height - (horizontal ? 1 : size);

                        int x, y;
                        bool goodPos;
                        do
                        {
                            goodPos = true;
                            x = random.Next(maxX);
                            y = random.Next(maxY);

                            for (int i = 0; i < size; i++)
                            {
                                if (board
                                    [x + (horizontal ? i : 0)]
                                    [y + (horizontal ? 0 : i)]
                                    .HasShip)
                                {
                                    goodPos = false;
                                    break;
                                }
                            }
                        } while (!goodPos);

                        for (int i = 0; i < size; i++)
                        {
                            board
                                [x + (horizontal ? i : 0)]
                                [y + (horizontal ? 0 : i)]
                                .HasShip = true;
                        }
                    }
                }

                this.Started = true;
                this.CurrentPlayerTurn = random.Next(this.Players.Count);
            });
        }

        public void Fire(string name, int x, int y)
        {
            this.LockAndWork(() =>
            {
                if (this.Finished)
                {
                    return;
                }

                var player = this.Players[name];
                if (player.Index != this.CurrentPlayerTurn)
                {
                    return;
                }

                var nextPlayer = (player.Index + 1) % this.Players.Count;
                var board = this.Boards[nextPlayer];

                var cell = board[x][y];
                if (cell.Fired)
                {
                    return;
                }

                cell.Fired = true;
                if (cell.HasShip)
                {
                    cell.Hit = true;
                    bool gameOver = true;

                    for (int x = 0; x < Width && gameOver; x++)
                    {
                        for (int y = 0; y < Height && gameOver; y++)
                        {
                            if (board[x][y].HasShip && !board[x][y].Hit)
                            {
                                gameOver = false;
                            }
                        }
                    }

                    if (gameOver)
                    {
                        this.Finished = true;
                    }
                }

                this.CurrentPlayerTurn = nextPlayer;
            });
        }

        public class BoardCell
        {

            public bool Fired { get; set; }
            public bool Hit { get; set; }
            public bool HasShip { get; set; }

        }

    }

}
