using System;
using System.Linq;

namespace ObscuritasMediaManager.ClientInterop.Commands;

public class CopyAudioToClipboardHandler : ICommandHandler
{
    public InteropCommand Command => InteropCommand.CopyAudioToClipboard;

    public async Task ExecuteAsync(object? payload) { }
}
