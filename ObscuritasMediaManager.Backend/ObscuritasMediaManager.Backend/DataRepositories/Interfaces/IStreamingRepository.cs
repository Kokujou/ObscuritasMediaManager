using System.Collections.Generic;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories.Interfaces
{
    public interface IStreamingRepository
    {
        public void BatchCreateStreamingEntries(IEnumerable<StreamingEntryModel> streamingEntries);
        public IEnumerable<StreamingEntryModel> Get(string name, string type);
    }
}