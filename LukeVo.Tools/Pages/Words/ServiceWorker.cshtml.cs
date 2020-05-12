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
    public class ServiceWorkerModel : PageModel
    {

        IHostEnvironment env;
        public ServiceWorkerModel(IHostEnvironment env)
        {
            this.env = env;
        }

        public IActionResult OnGet()
        {
            this.Response.Headers.Add("Service-Worker-Allowed", "/words");
            return this.PhysicalFile(Path.Combine(env.ContentRootPath, "wwwroot/words/_pwa-sw.js"), "application/javascript");
        }
    }
}
