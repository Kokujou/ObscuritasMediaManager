using System.Collections.Generic;
using System.Data.Linq;
using System.Data.SQLite;
using ObscuritasMediaManager.Backend.DataRepositories.Interfaces;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories
{
    public class GenreRepository : IGenreRepository
    {
        private readonly DataContext _context;

        public GenreRepository()
        {
            var connection = new SQLiteConnection("Data Source=database.sqlite");
            _context = new DataContext(connection);
        }

        public IEnumerable<Genre> GetAll()
        {
            var genreTable = _context.GetTable<Genre>();
            return genreTable;
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}