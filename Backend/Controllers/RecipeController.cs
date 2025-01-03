using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ObscuritasMediaManager.Backend.Controllers.Responses;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class RecipeController(RecipeRepository recipeRepository) : ControllerBase
{
    [HttpGet]
    public IQueryable<RecipeModel> GetAllRecipes()
    {
        return recipeRepository.GetAll();
    }

    [HttpGet("{id}")]
    public async Task<RecipeModel> GetRecipe(Guid id)
    {
        return await recipeRepository.GetAsync(id);
    }

    [HttpPost]
    public async Task<Guid> CreateRecipe([FromBody] RecipeModel recipe)
    {
        recipe.Id = Guid.NewGuid();
        //    foreach (var ingredient in recipe.Ingredients) ingredient.RecipeId = recipe.Id;

        await recipeRepository.CreateRecipeAsync(recipe);
        return recipe.Id!.Value;
    }

    [HttpPatch]
    public async Task UpdateRecipeAsync(RecipeModel recipe)
    {
        var current = await recipeRepository.GetAsync(recipe.Id!.Value);
        if (current is null) throw new("recipe not found");

        await recipeRepository.UpdateRecipeAsync(recipe);
    }

    [HttpPost("ingredients/search/{search}")]
    public IQueryable<IngredientResponse> SearchIngredients(string search,
        [FromQuery] int maxItems = 5)
    {
        return recipeRepository.SearchIngredients(search, maxItems).Select(IngredientResponse.FromRecipeMapping);
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