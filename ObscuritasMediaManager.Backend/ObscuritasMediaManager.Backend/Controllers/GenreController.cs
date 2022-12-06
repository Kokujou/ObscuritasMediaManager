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
    public async Task<ActionResult<IEnumerable<GenreModel>>> GetAll()
    {
        try
        {
            var genreList = await _genreRepository.GetAllAsync();
            return Ok(genreList);
        }
        catch (Exception e)
        {
            return BadRequest(e);
        }
    }
}