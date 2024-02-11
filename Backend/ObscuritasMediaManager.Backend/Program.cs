global using ObscuritasMediaManager.Backend.Attributes;
global using Serilog;
global using System;
using ObscuritasMediaManager.Backend;
using Serilog.Events;

Host.CreateDefaultBuilder(args)
    .UseSerilog(
        (hostContext, services, configuration) 
        => configuration.WriteTo
            .File(
                @"C:\LogFiles\ObscuritasMediaManager\Backend.log", LogEventLevel.Warning, retainedFileCountLimit: 2,
                rollingInterval: RollingInterval.Day))
    .ConfigureWebHostDefaults(webBuilder => webBuilder.UseStartup<Startup>())
    .Build()
    .Run();