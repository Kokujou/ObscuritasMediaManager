using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories;

public class GenreRepository(DatabaseContext context)
{
    public IQueryable<MediaGenreModel> GetAll()
    {
        return context.MediaGenres;
    }

    public async Task AddGenreAsync(MediaGenreModel genreModel)
    {
        await context.MediaGenres.AddAsync(genreModel);
        await context.SaveChangesAsync();
    }

    public async Task RemoveGenreAsync(Guid id)
    {
        var genre = await context.MediaGenres.FirstOrDefaultAsync(x => x.Id == id);
        if (genre is null) return;
        context.MediaGenres.Remove(genre);
        await context.SaveChangesAsync();
    }
}