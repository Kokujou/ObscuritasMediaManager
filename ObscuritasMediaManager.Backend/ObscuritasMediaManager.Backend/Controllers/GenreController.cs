using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ObscuritasMediaManager.Backend.DataRepositories.Interfaces;

namespace ObscuritasMediaManager.Backend.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class GenreController : ControllerBase
    {
        private readonly IGenreRepository _genreRepository;

        public GenreController(IGenreRepository genreRepository)
        {
            _genreRepository = genreRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
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
}