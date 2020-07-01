using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LukeVo.Games.Models.Blackjack;
using LukeVo.Games.Models.Numbers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LukeVo.Games.Controllers
{
    [Route("api/blackjack/{id}")]
    [ApiController]
    public class BlackjackController : ControllerBase
    {
        IGameManager manager;
        public BlackjackController(IGameManager manager)
        {
            this.manager = manager;
        }

        [HttpGet, Route("join")]
        public IActionResult Join(string id, string name)
        {
            var session = this.Get(id);

            try
            {
                session.Join(name);
                return this.Ok();
            }
            catch (ArgumentException)
            {
                return this.BadRequest("Someone with that name already joined.");
            }
        }

        [HttpGet, Route("")]
        public IActionResult GameStatus(string id)
        {
            var session = this.Get(id);
            return this.Ok(session);
        }

        [HttpGet, Route("start")]
        public IActionResult Start(string id)
        {
            var session = this.Get(id);
            session.Start();

            return this.Ok();
        }

        [HttpGet, Route("deal")]
        public IActionResult Deal(string id, int player)
        {
            var session = this.Get(id);
            session.Deal(player);

            return this.Ok();
        }

        [HttpGet, Route("lock")]
        public IActionResult Lock(string id, int player)
        {
            var session = this.Get(id);
            session.Lock(player);

            return this.Ok();
        }

        BlackjackGameSession Get(string id)
        {
            return this.manager.GetBlackjack(id);
        }
    }
}
