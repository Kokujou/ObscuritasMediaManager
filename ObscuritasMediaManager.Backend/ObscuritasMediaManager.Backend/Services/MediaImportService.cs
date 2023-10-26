using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.Services;

public class MediaImportService
{
    public async IAsyncEnumerable<MediaModel> ImportRootFolderAsync(string rootFolderPath)
    {
        var topLevel = Directory.GetDirectories(rootFolderPath);
        foreach (var mediaPath in topLevel)
        {
            var media = new MediaModel { Id = Guid.NewGuid(), Name = new DirectoryInfo(mediaPath).Name, StreamingEntries = new() };
            var seasonPaths = Directory.GetDirectories(mediaPath);

            foreach (var seasonPath in seasonPaths)
            {
                var seasonName = new DirectoryInfo(seasonPath).Name;
                await foreach (var episode in GetSeasonEntriesAsync(media.Id, seasonName, seasonPath)) 
                    media.StreamingEntries.Add(episode);
            }

            if (seasonPaths.Length <= 0)
                await foreach (var episode in GetSeasonEntriesAsync(media.Id, "Staffel 1", mediaPath))
                    media.StreamingEntries.Add(episode);
            else
                await foreach (var episode in GetFilesAsSeasonsAsync(media.Id, mediaPath))
                    media.StreamingEntries.Add(episode);

            yield return media;
        }
    }

    private async IAsyncEnumerable<StreamingEntryModel> GetFilesAsSeasonsAsync(Guid mediaId, string path)
    {
        foreach (var episodePath in Directory.GetFiles(path))
        {
            var seasonName = new FileInfo(episodePath).Name;
            if (!(await FFMPEGExtensions.HasVideoStreamAsync(episodePath)))
                continue;
            yield return new() { Id = mediaId, Src = episodePath, Season = seasonName, Episode = 1 };
        }
    }

    private async IAsyncEnumerable<StreamingEntryModel> GetSeasonEntriesAsync(Guid mediaId, string name, string path)
    {
        var filePaths = Directory.GetFiles(path);

        for (var episode = 1; episode <= filePaths.Length; episode++)
        {
            var filePath = filePaths[episode - 1];
            if (!(await FFMPEGExtensions.HasVideoStreamAsync(filePath)))
                continue;
            yield return new() { Id = mediaId, Season = name, Src = filePath, Episode = episode };
        }
    }
}
