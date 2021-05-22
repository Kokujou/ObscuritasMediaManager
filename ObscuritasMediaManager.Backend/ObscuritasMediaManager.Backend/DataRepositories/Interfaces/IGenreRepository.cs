using System.Collections.Generic;
using System.Threading.Tasks;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories.Interfaces
{
    public interface IGenreRepository
    {
        public Task<IEnumerable<GenreModel>> GetAllAsync();
    }
}