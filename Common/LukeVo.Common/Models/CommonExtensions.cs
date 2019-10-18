using LukeVo.Common.Models;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;
using System.Linq;
using System.Globalization;
using Microsoft.AspNetCore.Http;

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

namespace Microsoft.AspNetCore.Builder
{

    public static class AspNetAppCommonExtensions
    {

        public static IApplicationBuilder UseI18n(this IApplicationBuilder app)
        {
            app.Use(async (context, next) =>
            {
                // Check if language is being forced
                CultureInfo current = null;
                var languageQuery = context.Request.Query["language"];
                if (languageQuery.Any())
                {
                    current = TryParseOrNull(languageQuery[0]);
                }

                // From cookie
                if (current == null)
                {
                    var languageCookie = context.Request.Cookies["language"];
                    if (languageCookie != null)
                    {
                        current = TryParseOrNull(languageCookie);
                    }
                }
                
                // From Accept-Language header
                if (current == null)
                {
                    var languageHeader = context.Request.GetTypedHeaders().AcceptLanguage
                        .OrderByDescending(q => q.Quality)
                        .FirstOrDefault();

                    if (languageHeader != null)
                    {
                        current = TryParseOrNull(languageHeader.Value.Value);
                    }
                }

                if (current != null)
                {
                    CultureInfo.CurrentUICulture = current;
                    context.Response.Cookies.Append("language", current.TwoLetterISOLanguageName);
                }
                
                await next.Invoke();
            });

            return app;
        }

        static CultureInfo TryParseOrNull(string code)
        {
            try
            {
                return CultureInfo.GetCultureInfo(code);
            }
            catch (Exception)
            {
                return null;
            }
        }

    }

}
