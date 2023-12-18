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

    public IQueryable<MediaGenreModel> GetAll()
    {
        return _context.MediaGenres;
    }

    public async Task AddGenreAsync(MediaGenreModel genreModel)
    {
        await _context.MediaGenres.AddAsync(genreModel);
        await _context.SaveChangesAsync();
    }

    public async Task RemoveGenreAsync(Guid id)
    {
        var genre = await _context.MediaGenres.FirstOrDefaultAsync(x => x.Id == id);
        if (genre is null) return;
        _context.MediaGenres.Remove(genre);
        await _context.SaveChangesAsync();
    }
}