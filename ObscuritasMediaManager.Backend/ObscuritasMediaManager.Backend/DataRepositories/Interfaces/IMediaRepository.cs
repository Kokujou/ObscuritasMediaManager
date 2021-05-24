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

        public Task<MediaModel> GetAsync(Guid guid);

        public Task UpdateMediaAsync(MediaModel updated);

        public Task AddMediaImageAsync(Guid guid, string mediaImage);

        public Task RemoveMediaImageAsync(Guid guid);
    }
}