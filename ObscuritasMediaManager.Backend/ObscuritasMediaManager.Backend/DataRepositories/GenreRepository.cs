using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.DataRepositories.Interfaces;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories
{
    public class GenreRepository : IGenreRepository
    {
        private readonly DatabaseContext _context;

        public GenreRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<GenreModel>> GetAllAsync()
        {
            return await _context.Genres.ToListAsync();
        }
    }
}