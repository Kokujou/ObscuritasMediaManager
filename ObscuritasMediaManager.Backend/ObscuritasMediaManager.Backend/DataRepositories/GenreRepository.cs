using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using ObscuritasMediaManager.Backend.DataRepositories.Interfaces;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories
{
    public class GenreRepository : IGenreRepository
    {
        public async Task<IEnumerable<GenreModel>> GetAllAsync()
        {
            var genreTable = DisposableTableExtension.GetTable<GenreModel>();
            var genres = await genreTable.ToListAsync();
            await genreTable.DisposeAsync();
            return genres;
        }
    }
}