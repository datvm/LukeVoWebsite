using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LukeVo.Games.Models.Numbers;
using LukeVo.Games.Models.Ships;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LukeVo.Games.Controllers
{
    [Route("api/ships/{id}")]
    [ApiController]
    public class ShipsController : ControllerBase
    {
        IGameManager manager;
        public ShipsController(IGameManager manager)
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

        [HttpGet, Route("fire")]
        public IActionResult Fire(string id, string name, int x, int y)
        {
            var session = this.Get(id);
            session.Fire(name, x, y);

            return this.Ok();
        }

        ShipsGameSession Get(string id)
        {
            return this.manager.GetShips(id);
        }
    }
}
