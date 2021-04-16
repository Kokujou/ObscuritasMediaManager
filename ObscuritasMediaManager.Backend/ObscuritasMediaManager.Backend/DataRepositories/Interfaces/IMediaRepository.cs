using System;
using System.Collections.Generic;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories.Interfaces
{
    public interface IMediaRepository : IDisposable
    {
        public void BatchCreateMedia(IEnumerable<MediaModel> media);
    }
}