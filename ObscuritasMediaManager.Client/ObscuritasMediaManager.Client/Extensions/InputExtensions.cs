using Microsoft.AspNetCore.Components;
using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.Extensions;

public static class InputExtensions
{
    public static async Task StartMouseMoveInputLoopAsync(this ComponentBase component, Func<Task> asyncAction,
        TimeSpan? interval = null)
    {
        interval ??= TimeSpan.FromMilliseconds(10);

        while (true)
        {
            await Task.Delay(interval.Value);
            await asyncAction();

            var result = WindowsInteropService.GetAsyncKeyState(0x01);
            if (result == 0) return;
        }
    }
}
