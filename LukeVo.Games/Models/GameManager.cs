using LukeVo.Games.Models.Board;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LukeVo.Games.Models.Numbers
{
    public interface IGameManager
    {
        BoardGameSession GetBoard(string id);
        NumbersGameSession GetNumbers(string id);
    }

    public class GameManager : IGameManager
    {

        ConcurrentDictionary<string, NumbersGameSession> Numbers { get; set; } = new ConcurrentDictionary<string, NumbersGameSession>();
        ConcurrentDictionary<string, BoardGameSession> Board { get; set; } = new ConcurrentDictionary<string, BoardGameSession>();

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
