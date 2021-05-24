using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories.Interfaces
{
    public interface IStreamingRepository : IAsyncDisposable
    {
        public Task BatchCreateStreamingEntriesAsync(IEnumerable<StreamingEntryModel> streamingEntries);
        public Task<IEnumerable<StreamingEntryModel>> GetAsync(Guid guid);
        public Task<StreamingEntryModel> GetAsync(Guid guid, string season, int episode);
    }
}