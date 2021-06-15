using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories.Interfaces
{
    public interface IMusicRepository
    {
        public Task BatchCreateMusicTracksAsync(IEnumerable<MusicModel> tracks);
        public Task UpdateAsync(MusicModel updated);
        public Task<MusicModel> GetAsync(Guid guid);
        public Task<IEnumerable<MusicModel>> GetAllAsync();

        public Task<IEnumerable<InstrumentModel>> GetInstruments();
    }
}