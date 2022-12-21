using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class RecipeController : ControllerBase
{
    private readonly RecipeRepository _recipeRepository;

    public RecipeController(RecipeRepository recipeRepository)
    {
        _recipeRepository = recipeRepository;
    }

    [HttpGet]
    public IQueryable<RecipeModel> GetAllRecipes()
    {
        return _recipeRepository.GetAll();
    }

    [HttpGet("{id}")]
    public async Task<RecipeModel> GetRecipe(Guid id)
    {
        return await _recipeRepository.Get(id);
    }

    [HttpPost]
    public async Task CreateRecipe(RecipeModel recipe)
    {
        recipe.Id = Guid.NewGuid();
        foreach (var ingredient in recipe.Ingredients)
        {
            ingredient.RecipeId = recipe.Id;
            ingredient.Id = Guid.NewGuid();
        }

        await _recipeRepository.CreateRecipe(recipe);
    }
}