using ObscuritasMediaManager.Backend.Data.Music;
using ObscuritasMediaManager.Backend.DataRepositories;
using System;
using System.IO;
using System.Linq;
using Xabe.FFmpeg;

namespace ObscuritasMediaManager.Client.Services;

public class AudioFileImportService(MusicRepository musicRepository)
{
    public IEnumerable<MusicModel> ProcessFolder(string folderPath)
    {
        var tracks = Directory.EnumerateFiles(folderPath, "*.*", SearchOption.AllDirectories)
            .Where(
                filePath => FileDialogConstants.AudioExtensions
                    .Any(ext => filePath.EndsWith(ext, StringComparison.OrdinalIgnoreCase)))
            .Select(filePath => new MusicModel
                                {
                                    Path = filePath,
                                    Name = filePath.Split("\\").Last(),
                                    Instrumentation = Instrumentation.Mixed,
                                    Author = "unset",
                                    Language = Nation.Japanese,
                                    Nation = Nation.Japanese,
                                }.CalculateHash());

        return tracks;
    }

    public async Task<List<MusicModel>> ValidateTracksAsync(IEnumerable<MusicModel> tracks)
    {
        var validTracks = new List<MusicModel>();
        var trackHashs = tracks.Select(x => x.Hash).Distinct().ToList();
        List<string> duplicateHashs = await musicRepository.GetDuplicateHashsAsync(trackHashs);
        tracks = tracks.Where(x => !duplicateHashs.Contains(x.Hash));

        foreach (var track in tracks)
        {
            var mediaInfo = await FFmpeg.GetMediaInfo(track.Path);
            if (mediaInfo.AudioStreams.Any()) validTracks.Add(track);
        }

        return validTracks;
    }
}
