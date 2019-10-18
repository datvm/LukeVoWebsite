using System;
using System.Collections.Generic;
using System.Text;

namespace LukeVo.Common.Models
{
    
    public class DefaultWebSettings
    {

        public LanguageItem[] Languages { get; set; } = new LanguageItem[0];

        public class LanguageItem
        {
            public string Code { get; set; }
            public string LocalName { get; set; }
            public string EnglishName { get; set; }
        }

    }

}
