using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class RecipeController(RecipeRepository recipeRepository, DatabaseContext context) : ControllerBase
{
    [HttpGet]
    public IQueryable<RecipeModelBase> GetAllRecipes()
    {
        return recipeRepository.GetAll();
    }

    [HttpGet("{recipeId}/image")]
    public async Task<IActionResult> GetRecipeImage(Guid recipeId)
    {
        var image = await recipeRepository.GetImageAsync(recipeId);
        if (image.ImageData is null) return NoContent();

        Response.Headers["Cache-Control"] = "public, max-age=31536000, immutable";

        var fileType = image.ImageData["data:".Length..image.ImageData.IndexOf(';')];
        return File(Convert.FromBase64String(image.ImageData[(image.ImageData.IndexOf(',') + 1)..]), fileType);
    }

    [HttpGet("{recipeId}/thumb")]
    public async Task<IActionResult> GetRecipeThumb(Guid recipeId)
    {
        var image = await recipeRepository.GetImageAsync(recipeId);
        if (image.ThumbData is null) return NoContent();

        Response.Headers["Cache-Control"] = "public, max-age=31536000, immutable";

        var fileType = image.ThumbData["data:".Length..image.ThumbData.IndexOf(';')];
        return File(Convert.FromBase64String(image.ThumbData[(image.ThumbData.IndexOf(',') + 1)..]), fileType);
    }

    [HttpPost("search-dishes")]
    public IQueryable<RecipeModelBase> SearchDishes(string search)
    {
        return recipeRepository.SearchDishes(search);
    }

    [HttpGet("{id}")]
    public async Task<RecipeModelBase> GetRecipe(Guid id)
    {
        return await recipeRepository.GetAsync(id);
    }

    [HttpPut("dish")]
    public async Task ImportDish([FromBody] FoodModel dish)
    {
        await recipeRepository.CreateDishAsync(dish);
    }

    [HttpPost]
    public async Task<Guid> CreateRecipe([FromBody] RecipeModel recipe)
    {
        await recipeRepository.CreateRecipeAsync(recipe);
        return recipe.Id;
    }

    [HttpPatch]
    public async Task UpdateRecipeAsync(RecipeModel recipe)
    {
        var current = await recipeRepository.GetAsync(recipe.Id);
        if (current is null) throw new("recipe not found");

        await recipeRepository.UpdateRecipeAsync(recipe);
    }

    [HttpGet("ingredients")]
    public IQueryable<IngredientModel> GetIngredients()
    {
        return recipeRepository.GetIngredients();
    }

    [HttpPost("ingredients/search/{search}")]
    public IQueryable<IngredientModel> SearchIngredients(string search, [FromQuery] int maxItems = 5)
    {
        return recipeRepository.SearchIngredients(search, maxItems);
    }

    [HttpPost("{recipeId}/ingredient")]
    public async Task<Guid> AddIngredientAsync(Guid recipeId,
        [FromBody] RecipeIngredientMappingModel ingredient)
    {
        ingredient.RecipeId = recipeId;
        ingredient.Id = Guid.NewGuid();

        await recipeRepository.AddIngredientAsync(ingredient);

        return ingredient.Id!.Value;
    }

    [HttpPatch("ingredient/{ingredientName}")]
    public async Task UpdateIngredientAsync(string ingredientName, [FromBody] IngredientModel ingredient)
    {
        if (ingredientName != ingredient.IngredientName) throw new("Ingredients names do not match");
        await recipeRepository.UpdateIngredientAsync(ingredient);
    }

    [HttpDelete("{recipeId}/ingredient/{ingredientId}")]
    public async Task DeleteIngredientAsync(Guid recipeId, Guid ingredientId)
    {
        await recipeRepository.DeleteIngredientAsync(recipeId, ingredientId);
    }

    [HttpPost("cookware/search")]
    public IQueryable<string> SearchCookwareAsync([FromBody] string search, [FromQuery] int maxItems = 5)
    {
        return recipeRepository.GetCookware(search, maxItems);
    }

    [HttpPost("{recipeId}/cookware")]
    public async Task<Guid> AddCookwareAsync(Guid recipeId,
        [FromBody] RecipeCookwareMappingModel cookware)
    {
        cookware.RecipeId = recipeId;
        cookware.Id = Guid.NewGuid();

        await recipeRepository.AddCookwareAsync(cookware);

        return cookware.Id!.Value;
    }

    [HttpDelete("{recipeId}/cookware/{cookwareId}")]
    public async Task DeleteCookwareAsync(Guid recipeId, Guid cookwareId)
    {
        await recipeRepository.DeleteCookwareAsync(recipeId, cookwareId);
    }

    [HttpDelete("{recipeId}/soft")]
    public async Task SoftDeleteRecipeAsync(Guid recipeId)
    {
        await recipeRepository.DeleteRecipeAsync(recipeId);
    }

    [HttpPost("{recipeId}/undelete")]
    public async Task UndeleteRecipeAsync(Guid recipeId)
    {
        await recipeRepository.UndeleteRecipeAsync(recipeId);
    }

    [HttpDelete("{recipeId}/hard")]
    public async Task HardDeleteRecipeAsync(Guid recipeId)
    {
        await recipeRepository.DeleteRecipeAsync(recipeId, true);
    }
}