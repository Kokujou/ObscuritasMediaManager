using System.Collections.Generic;
using System.Threading.Tasks;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories.Interfaces
{
    public interface IStreamingRepository
    {
        public Task BatchCreateStreamingEntriesAsync(IEnumerable<StreamingEntryModel> streamingEntries);
        public Task<IEnumerable<StreamingEntryModel>> GetAsync(string name, string type);
        public Task<StreamingEntryModel> GetAsync(string name, string type, string season, int episode);
    }
}