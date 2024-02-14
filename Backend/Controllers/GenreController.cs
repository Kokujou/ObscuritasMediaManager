using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ObscuritasMediaManager.Backend.Data.Media;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.Controllers;

[Authorize]
[ApiController]
[Route("/api/[controller]")]
public class GenreController(GenreRepository genreRepository) : ControllerBase
{
    [HttpGet]
    public IQueryable<MediaGenreModel> GetAll()
    {
        return genreRepository.GetAll();
    }

    [HttpPut("section/{section}/name/{name}")]
    public async Task AddGenre(MediaGenreCategory section, string name)
    {
        await genreRepository.AddGenreAsync(new() { Id = Guid.NewGuid(), Section = section, Name = name });
    }

    [HttpDelete("{id:guid}")]
    public async Task RemoveGenre(Guid id)
    {
        await genreRepository.RemoveGenreAsync(id);
    }
}