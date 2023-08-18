using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.Controllers;

[Authorize]
[ApiController]
[Route("/api/[controller]")]
public class GenreController : ControllerBase
{
    private readonly GenreRepository _genreRepository;

    public GenreController(GenreRepository genreRepository)
    {
        _genreRepository = genreRepository;
    }

    [HttpGet]
    public IQueryable<GenreModel> GetAll()
    {
        return _genreRepository.GetAll();
    }

    [HttpPut("section/{section}/name/{name}")]
    public async Task AddGenre(string section, string name)
    {
        await _genreRepository.AddGenreAsync(new GenreModel { Id = Guid.NewGuid(), Section = section, Name = name });
    }

    [HttpDelete("{id:guid}")]
    public async Task RemoveGenre(Guid id)
    {
        await _genreRepository.RemoveGenreAsync(id);
    }
}