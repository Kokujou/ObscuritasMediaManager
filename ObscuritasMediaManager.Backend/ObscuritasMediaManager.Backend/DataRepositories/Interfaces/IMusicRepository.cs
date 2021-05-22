using System.Collections.Generic;
using System.Threading.Tasks;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories.Interfaces
{
    public interface IMusicRepository
    {
        public Task BatchCreateMusicTracksAsync(IEnumerable<MusicModel> tracks);
        public Task UpdateAsync(string name, string author, MusicModel updated);
        public Task<MusicModel> GetAsync(string name, string author);
        public Task<IEnumerable<MusicModel>> GetAllAsync();
    }
}