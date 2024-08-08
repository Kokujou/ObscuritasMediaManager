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
            var mediaInfo = await FFmpeg.GetMediaInfo(filePath);
            return mediaInfo.VideoStreams.Any();
        }
        catch
        {
            return false;
        }
    }
}