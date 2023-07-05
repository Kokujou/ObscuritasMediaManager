using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;

namespace ObscuritasMediaManager.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FileController : ControllerBase
{
    public static string Logs = "";

    [HttpGet("video")]
    public ActionResult<object> GetVideo(string videoPath = "")
    {
        if (string.IsNullOrEmpty(videoPath) || !System.IO.File.Exists(videoPath))
            return BadRequest("invalid file path");

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

    [HttpGet("audio")]
    public ActionResult<object> GetAudio(string audioPath = "", bool highCompatibility = false)
    {
        if (string.IsNullOrEmpty(audioPath) || !System.IO.File.Exists(audioPath))
            return BadRequest("invalid file path");

        var path = new FileInfo(audioPath);

        if (!highCompatibility)
        {
            new FileExtensionContentTypeProvider().TryGetContentType(audioPath, out var contentType);
            return File(new BufferedStream(System.IO.File.Open(audioPath, FileMode.Open, FileAccess.Read,
                FileShare.Read)), "audio/x-caf");
        }


        var ffmpeg = new Process();
        var startInfo = new ProcessStartInfo("D:\\Programme\\ffmpeg\\bin\\ffmpeg.exe",
            $"-i \"{path.FullName}\" -c:a libmp3lame -q:a 2 -filter:a loudnorm -f mp3 pipe:1")
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
        ffmpeg.Exited += OnFinished;

        ffmpeg.Start();
        ffmpeg.BeginErrorReadLine();

        return File(new BufferedStream(ffmpeg.StandardOutput.BaseStream), "audio/ogg");
    }

    [HttpPost("validate-files")]
    public ActionResult Validate([FromBody] IEnumerable<string> fileUrls)
    {
        foreach (var filePath in fileUrls)
            if (!System.IO.File.Exists(filePath))
                return BadRequest($"File: {filePath} does not exist!");

        return Ok();
    }

    private void OnErrorDataReceived(object sender, DataReceivedEventArgs args)
    {
        Logs += args.Data + "\r\n";
    }

    private void OnFinished(object sender, EventArgs args)
    {
        Logs = "";
    }
}