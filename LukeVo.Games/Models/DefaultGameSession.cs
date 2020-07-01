using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LukeVo.Games.Models
{
    public class DefaultGameSession
    {

        public string Id { get; set; }
        protected SemaphoreSlim Semaphore { get; } = new SemaphoreSlim(1, 1);
        public Dictionary<string, GamePlayer> Players { get; set; } = new Dictionary<string, GamePlayer>();
        public DateTime CreatedTime { get; set; } = DateTime.Now;
        public bool Started { get; set; }
        public bool Finished { get; set; }

        public DefaultGameSession(string id)
        {
            this.Id = id;
        }

        public async Task LockAndWorkAsync(Func<Task> work)
        {
            try
            {
                await this.Semaphore.WaitAsync();
                await work();
            }
            finally
            {
                this.Semaphore.Release();
            }
        }

        public void LockAndWork(Action work)
        {
            try
            {
                this.Semaphore.Wait();
                work();
            }
            finally
            {
                this.Semaphore.Release();
            }
        }

        public virtual void Join(string name)
        {
            this.LockAndWork(() =>
            {
                if (this.Players.ContainsKey(name))
                {
                    throw new ArgumentException("Name already exists");
                }

                this.Players[name] = new GamePlayer()
                {
                    Name = name,
                    Index = this.Players.Count,
                };
            });
        }

        public GamePlayer GetPlayer(int id)
        {
            return this.Players.FirstOrDefault(q => q.Value.Index == id).Value;
        }

    }


    public class GamePlayer
    {
        public string Name { get; set; }
        public int Score { get; set; }
        public int Index { get; set; }
    }

}
