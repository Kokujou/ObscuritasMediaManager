using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ObscuritasMediaManager.Backend.Controllers.Requests;
using ObscuritasMediaManager.Backend.DataRepositories.Interfaces;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MusicController : ControllerBase
    {
        private readonly IMusicRepository _repository;

        public MusicController(IMusicRepository repository)
        {
            _repository = repository;
        }

        [HttpPost]
        public async Task<IActionResult> BatchCreateMusicTracks(IEnumerable<MusicModel> tracks)
        {
            try
            {
                await _repository.BatchCreateMusicTracksAsync(tracks);
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e.ToString());
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MusicModel>>> GetAllAsync()
        {
            try
            {
                return Ok(await _repository.GetAllAsync());
            }
            catch (Exception e)
            {
                return BadRequest(e.ToString());
            }
        }

        [HttpGet("{guid:Guid}")]
        public async Task<ActionResult<MusicModel>> GetAsync(Guid guid)
        {
            try
            {
                return Ok(await _repository.GetAsync(guid));
            }
            catch (Exception e)
            {
                return BadRequest(e.ToString());
            }
        }

        [HttpGet("instruments")]
        public async Task<ActionResult<IEnumerable<InstrumentModel>>> GetInstruments()
        {
            try
            {
                return Ok(await _repository.GetInstruments());
            }
            catch (Exception e)
            {
                return BadRequest(e.ToString());
            }
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateAsync(Guid id, [FromBody] UpdateRequest<MusicModel> updateRequest)
        {
            try
            {
                if (updateRequest.OldModel.Id != default && id != updateRequest.OldModel.Id)
                    return BadRequest("Ids of objects did not match");
                var invalidInstruments = await GetInvalidInstrumentsAsync(updateRequest.NewModel.InstrumentsString);
                if (invalidInstruments.Count > 0)
                    return BadRequest($"sent instruments invalid: {string.Join(",", invalidInstruments)}");

                await _repository.UpdateAsync(id, updateRequest.OldModel, updateRequest.NewModel);
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e.ToString());
            }
        }

        private async Task<List<string>> GetInvalidInstrumentsAsync(string instrumentsString)
        {
            if (string.IsNullOrEmpty(instrumentsString)) return new List<string>();

            var instruments = await _repository.GetInstruments();
            var instrumentStrings = instruments.Select(x => x.Name);
            var sentInstruments = instrumentsString.Split(",");
            var invalidInstruments = sentInstruments.Except(instrumentStrings).ToList();
            return invalidInstruments;
        }
    }
}