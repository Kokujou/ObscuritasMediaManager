using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories;

public class GenreRepository
{
    private readonly DatabaseContext _context;

    public GenreRepository(DatabaseContext context)
    {
        _context = context;
    }

    public IQueryable<GenreModel> GetAll()
    {
        return _context.Genres;
    }

    public async Task AddGenreAsync(GenreModel genreModel)
    {
        await _context.Genres.AddAsync(genreModel);
        await _context.SaveChangesAsync();
    }

    public async Task RemoveGenreAsync(Guid id)
    {
        var genre = await _context.Genres.FirstOrDefaultAsync(x => x.Id == id);
        if (genre is null) return;
        _context.Genres.Remove(genre);
        await _context.SaveChangesAsync();
    }
}