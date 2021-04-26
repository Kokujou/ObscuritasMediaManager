using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace ObscuritasMediaManager.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileController : ControllerBase
    {
        public static string Logs = "";

        [HttpGet]
        public async Task<IActionResult> GetFile(string filePath = "")
        {
            if (string.IsNullOrEmpty(filePath)) return BadRequest("invalid file path");

            var ffmpeg = new Process();
            var startinfo = new ProcessStartInfo("D:\\Programme\\ffmpeg\\bin\\ffmpeg.exe",
                $"-i \"{filePath}\" -c:v copy -c:a copy -movflags frag_keyframe+empty_moov -f mp4 -");
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

        [HttpPost("validate-files")]
        public IActionResult Validate([FromBody] IEnumerable<string> fileUrls)
        {
            foreach (var filePath in fileUrls)
                if (!System.IO.File.Exists(filePath))
                    return BadRequest($"File: {filePath} does not exist!");

            return Ok();
        }

        private void OnErrorDataReceived(object sender, DataReceivedEventArgs args)
        {
            Logs += args.Data;
        }
    }
}