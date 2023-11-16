using ObscuritasMediaManager.Backend.Data.Media;
using ObscuritasMediaManager.Backend.Data.Music;

namespace ObscuritasMediaManager.Backend.Controllers.Requests;

public class MediaCreationRequest
{
    public string RootPath { get; set; }
    public MediaCategory Category { get; set; }
    public Language Language { get; set; }
}
