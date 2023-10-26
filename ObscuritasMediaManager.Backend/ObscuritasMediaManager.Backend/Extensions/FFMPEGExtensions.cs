using System;
using System.Linq;
using Xabe.FFmpeg;

namespace ObscuritasMediaManager.Backend.Extensions;

public static class FFMPEGExtensions
{
    public static async Task<bool> HasAudioStreamAsync(string filePath)
    {
        try
        {
            return (await FFmpeg.GetMediaInfo(filePath)).AudioStreams.Any();
        }
        catch
        {
            return false;
        }
    }

    public static async Task<bool> HasVideoStreamAsync(string filePath)
    {
        try
        {
            return (await FFmpeg.GetMediaInfo(filePath)).VideoStreams.Any();
        }
        catch
        {
            return false;
        }
    }
}
