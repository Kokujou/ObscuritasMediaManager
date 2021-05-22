using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories.Interfaces
{
    public interface IMediaRepository : IAsyncDisposable
    {
        public Task BatchCreateMediaAsync(IEnumerable<MediaModel> media);

        public Task<IEnumerable<MediaModel>> GetAllAsync(string type = "");

        public Task<MediaModel> GetAsync(string name, string animeType);

        public Task UpdateMediaAsync(string name, string type, MediaModel updated);

        public Task AddMediaImageAsync(string mediaName, string mediaType, string mediaImage);

        public Task RemoveMediaImageAsync(string mediaName, string mediaType);
    }
}