using MediaInfo;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

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
    public async Task<FileStreamResult> GetAudio(string audioPath = "", bool highCompatibility = false)
    {
        if (string.IsNullOrEmpty(audioPath) || !System.IO.File.Exists(audioPath))
            throw new("invalid file path");

        var path = new FileInfo(audioPath);

        var info = new MediaInfo.MediaInfo();
        info.Open(audioPath);
        var format = info.Get(StreamKind.General, 0, "Format");
        if (format == "MPEG-4" && info.Get(StreamKind.General, 0, "IsStreamable") != "Yes")
            highCompatibility = true;

        if (!highCompatibility)
        {
            var stream =
                new BufferedStream(System.IO.File.Open(audioPath, FileMode.Open, FileAccess.Read, FileShare.Read));
            return File(stream, "audio/mpeg", true);
        }

        var ffmpeg = new Process();
        var tempFile = Path.Combine(Path.GetTempPath(), $"{Guid.NewGuid()}.mp3");
        var startInfo = new ProcessStartInfo("D:\\Programme\\ffmpeg\\bin\\ffmpeg.exe",
            $"-i \"{path.FullName}\" -c:a libmp3lame -q:a 2 -filter:a loudnorm=I=-14:LRA=7:TP=-2 -f mp3 -b:a 256k -threads 0 -write_xing 1 {tempFile}")
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

        ffmpeg.WaitForExit();

        var fileStream = new FileStream(tempFile, FileMode.Open, FileAccess.Read, FileShare.Read, 4096, true);

        var ms = new MemoryStream();
        await fileStream.CopyToAsync(ms);
        ms.Position = 0;
        fileStream.Close();

        System.IO.File.Delete(tempFile);

        return File(ms, "audio/mpeg");
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