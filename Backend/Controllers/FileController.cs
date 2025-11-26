using MediaInfo;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Xabe.FFmpeg;

namespace ObscuritasMediaManager.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FileController : ControllerBase
{
    [HttpGet("video")]
    public FileStreamResult GetVideo(string videoPath = "")
    {
        if (string.IsNullOrEmpty(videoPath) || !System.IO.File.Exists(videoPath))
            throw new("invalid file path");

        var ffmpeg = new Process();
        var startinfo = new ProcessStartInfo("D:\\Programme\\ffmpeg\\bin\\ffmpeg.exe",
            $"-i \"{videoPath}\" -c:v copy -c:a copy -movflags frag_keyframe+empty_moov+delay_moov -f mp4 -");
        startinfo.RedirectStandardError = true;
        startinfo.RedirectStandardOutput = true;
        startinfo.RedirectStandardInput = true;
        startinfo.UseShellExecute = false;
        startinfo.CreateNoWindow = true;
        ffmpeg.StartInfo = startinfo;

        ffmpeg.ErrorDataReceived += OnErrorDataReceived;

        ffmpeg.Start();
        ffmpeg.BeginErrorReadLine();

        return File(new BufferedStream(ffmpeg.StandardOutput.BaseStream), "video/mp4");
    }

    [AllowAnonymous]
    [HttpGet("audio")]
    public FileStreamResult GetAudio(string audioPath = "", bool highCompatibility = false)
    {
        if (string.IsNullOrEmpty(audioPath) || !System.IO.File.Exists(audioPath))
            throw new("invalid file path");

        var path = new FileInfo(audioPath);

        var info = new MediaInfo.MediaInfo();
        info.Open(audioPath);
        var format = info.Get(StreamKind.General, 0, "Format");
        if (format == "MPEG-4" && info.Get(StreamKind.General, 0, "IsStreamable") != "Yes")
            highCompatibility = true;

        var detailedInfo = FFmpeg.GetMediaInfo(audioPath).Result;
        var audioStream = detailedInfo.AudioStreams.FirstOrDefault();
        var isMP3 = audioStream != null && audioStream.Codec.Equals("mp3", StringComparison.OrdinalIgnoreCase);

        if (!highCompatibility || isMP3)
        {
            var stream =
                new BufferedStream(System.IO.File.Open(audioPath, FileMode.Open, FileAccess.Read, FileShare.Read));
            return File(stream, "audio/mpeg", true);
        }

        var ffmpeg = new Process();
        var startInfo = new ProcessStartInfo("D:\\Programme\\ffmpeg\\bin\\ffmpeg.exe",
            $"-i \"{path.FullName}\" -c:a libmp3lame -q:a 2 -filter:a loudnorm=I=-14:LRA=7:TP=-2 -f mp3 -b:a 256k -threads 0 pipe:1")
        {
            RedirectStandardError = true,
            RedirectStandardOutput = true,
            RedirectStandardInput = true,
            UseShellExecute = false,
            CreateNoWindow = true
        };
        ffmpeg.EnableRaisingEvents = true;
        ffmpeg.StartInfo = startInfo;
        ffmpeg.ErrorDataReceived += OnErrorDataReceived;

        ffmpeg.Start();
        ffmpeg.BeginErrorReadLine();

        return File(ffmpeg.StandardOutput.BaseStream, "audio/mpeg");
    }

    [HttpPost("validate-files")]
    public bool Validate([FromBody] IEnumerable<string> fileUrls)
    {
        foreach (var filePath in fileUrls)
            if (!System.IO.File.Exists(filePath))
                return false;
        return true;
    }

    private void OnErrorDataReceived(object sender, DataReceivedEventArgs args)
    {
        Log.Error($"{args.Data}\r\n");
    }
}