global using System;
using ObscuritasMediaManager.Backend;

Host.CreateDefaultBuilder(args).ConfigureWebHostDefaults(webBuilder => webBuilder.UseStartup<Startup>()).Build().Run();