using LukeVo.Games.Models.Blackjack;
using LukeVo.Games.Models.Board;
using LukeVo.Games.Models.Ships;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LukeVo.Games.Models.Numbers
{
    public interface IGameManager
    {
        BlackjackGameSession GetBlackjack(string id);
        BoardGameSession GetBoard(string id);
        NumbersGameSession GetNumbers(string id);
        ShipsGameSession GetShips(string id);
    }

    public class GameManager : IGameManager
    {

        ConcurrentDictionary<string, NumbersGameSession> Numbers { get; set; } = new ConcurrentDictionary<string, NumbersGameSession>();
        ConcurrentDictionary<string, BoardGameSession> Board { get; set; } = new ConcurrentDictionary<string, BoardGameSession>();
        ConcurrentDictionary<string, ShipsGameSession> Ships { get; set; } = new ConcurrentDictionary<string, ShipsGameSession>();
        ConcurrentDictionary<string, BlackjackGameSession> Blackjack { get; set; } = new ConcurrentDictionary<string, BlackjackGameSession>();

        public NumbersGameSession GetNumbers(string id)
        {
            return this.GetGameSession(
                this.Numbers,
                id,
                () => new NumbersGameSession(id));
        }

        public BoardGameSession GetBoard(string id)
        {
            return this.GetGameSession(
                this.Board,
                id,
                () => new BoardGameSession(id));
        }

        public ShipsGameSession GetShips(string id)
        {
            return this.GetGameSession(
                this.Ships,
                id,
                () => new ShipsGameSession(id));
        }

        public BlackjackGameSession GetBlackjack(string id)
        {
            return this.GetGameSession(
                this.Blackjack,
                id,
                () => new BlackjackGameSession(id));
        }

        T GetGameSession<T>(ConcurrentDictionary<string, T> sessions, string id, Func<T> createFunc)
        {
            if (!sessions.TryGetValue(id, out var session))
            {
                session = createFunc();
                sessions[id] = session;
            }

            return session;
        }

    }

}
