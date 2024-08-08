using ObscuritasMediaManager.Backend.Data.Media;
using ObscuritasMediaManager.Backend.Data.Music;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.Controllers.Requests;

public class MediaCreationRequest
{
    public required string RootPath { get; set; }
    public MediaCategory Category { get; set; }
    public Language Language { get; set; }
    public MediaModel? Entry { get; set; }
}