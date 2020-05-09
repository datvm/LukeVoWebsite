using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Hosting;

namespace LukeVo.Tools.Pages.Words
{
    public class ListModel : PageModel
    {

        IHostEnvironment env;
        public ListModel(IHostEnvironment env)
        {
            this.env = env;
        }

        public IActionResult OnGet()
        {
            this.Response.Headers["Cache-Control"] = "public, max-age=604800";

            var filePath = Path.Combine(env.ContentRootPath, "wwwroot/apps/words/words.txt");
            return this.PhysicalFile(filePath, "text/plain");
        }

    }
}
