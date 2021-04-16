using System;
using System.Collections.Generic;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories.Interfaces
{
    public interface IStreamingRepository : IDisposable
    {
        public void BatchCreateStreamingEntries(IEnumerable<StreamingEntryModel> streamingEntries);
    }
}