using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LukeVo.Games.Models.Numbers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LukeVo.Games.Controllers
{

    [Route("api/numbers/{id}")]
    [ApiController]
    public class NumbersController : ControllerBase
    {

        IGameManager manager;
        public NumbersController(IGameManager manager)
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

        [HttpGet, Route("score")]
        public IActionResult Score(string id, string name, int number)
        {
            var session = this.Get(id);
            session.Score(name, number);

            return this.Ok();
        }

        NumbersGameSession Get(string id)
        {
            return this.manager.GetNumbers(id);
        }

    }

}
