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

    public static async Task<bool> HasVideoOrSubtitleStreamAsync(string filePath)
    {
        try
        {
            var mediaInfo = await FFmpeg.GetMediaInfo(filePath);
            return mediaInfo.VideoStreams.Any() || mediaInfo.SubtitleStreams.Any();
        }
        catch
        {
            return false;
        }
    }
}
