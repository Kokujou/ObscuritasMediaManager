using System;
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
        public IActionResult GetAll()
        {
            try
            {
                var genreList = _genreRepository.GetAll();
                return Ok(genreList);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }
    }
}