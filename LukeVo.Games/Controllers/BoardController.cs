using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LukeVo.Games.Models.Board;
using LukeVo.Games.Models.Numbers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LukeVo.Games.Controllers
{

    [Route("api/board/{id}")]
    [ApiController]
    public class BoardController : ControllerBase
    {
        IGameManager manager;
        public BoardController(IGameManager manager)
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

        [HttpGet, Route("click")]
        public IActionResult Click(string id, string name, int x, int y)
        {
            var session = this.Get(id);
            session.Click(name, x, y);

            return this.Ok();
        }

        BoardGameSession Get(string id)
        {
            return this.manager.GetBoard(id);
        }

    }

}
