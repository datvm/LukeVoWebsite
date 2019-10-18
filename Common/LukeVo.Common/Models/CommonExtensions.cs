using LukeVo.Common.Models;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;

namespace System
{

    public static class SystemCommonExtensions
    {

        public static string GetAssemblyDirectory(this Type type)
        {
            return type.Assembly.GetAssemblyDirectory();
        }

        public static string GetAssemblyDirectory(this Assembly assembly)
        {
            return Path.GetDirectoryName(assembly.Location);
        }

    }

}

namespace Microsoft.Extensions.DependencyInjection
{

    public static class DICommonExtensions
    {

        public static IServiceCollection AddFluint(this IServiceCollection services)
        {
            Fluint.Fluin.Initialize(builder =>
            {
                var assemblyPath = Assembly.GetCallingAssembly().GetAssemblyDirectory();
                var textsPath = Path.Combine(assemblyPath, "Texts");

                builder
                    .AddJsonFiles(textsPath, "common-")
                    .AddJsonFiles(textsPath, "texts-")
                    .SetFallbackLanguage("en");
            });

            return services;
        }

        public static T AddSettings<T>(this IServiceCollection services, IConfiguration config)
            where T : DefaultWebSettings, new()
        {
            var settings = new T();
            config.Bind(settings);

            services.AddSingleton<DefaultWebSettings>(settings);
            services.AddSingleton(settings);

            return settings;
        }

    }

}
