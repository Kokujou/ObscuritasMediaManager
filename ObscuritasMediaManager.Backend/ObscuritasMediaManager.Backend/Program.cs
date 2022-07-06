global using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using ObscuritasMediaManager.Backend;

Host.CreateDefaultBuilder(args)
    .ConfigureWebHostDefaults(webBuilder => webBuilder.UseStartup<Startup>())
    .Build().Run();