using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Controllers.Requests;
using ObscuritasMediaManager.Backend.Controllers.Responses;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class RecipeController(RecipeRepository recipeRepository, DatabaseContext context) : ControllerBase
{
    [HttpGet]
    public IQueryable<RecipeResponse> GetAllRecipes()
    {
        return recipeRepository.GetAll().ToList().AsQueryable();
    }

    [HttpGet("default")]
    public RecipeModel GetDefault()
    {
        return new() { Id = Guid.Empty, Title = "Rezepttitel", Description = "Rezeptbeschreibung" };
    }

    [HttpGet("{id}")]
    public async Task<RecipeResponse> GetRecipe(Guid id)
    {
        return await recipeRepository.GetAsync(id);
    }

    [HttpGet("{recipeId}/images/{thumbHash}")]
    public async Task<IActionResult> GetImageAsync(Guid recipeId, string thumbHash)
    {
        var image = await context.FoodImages.FirstAsync(x =>
            x.RecipeId == recipeId && x.ThumbHash.ToLower() == thumbHash.ToLower());
        if (image.ImagePath is null) return NoContent();

        Response.Headers.CacheControl = "public, max-age=31536000, immutable";

        return File(new FileStream(image.ImagePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite), "image/png");
    }

    [HttpGet("{recipeId}/images/{thumbHash}/thumb")]
    public async Task<IActionResult> GetImageThumbAsync(Guid recipeId, string thumbHash)
    {
        var thumb = await context.FoodImages.FirstAsync(x =>
            x.RecipeId == recipeId && x.ThumbHash.ToLower() == thumbHash.ToLower());
        if (thumb.ThumbData is null) return NoContent();

        Response.Headers.CacheControl = "public, max-age=31536000, immutable";

        return File(thumb.ThumbData, "image/png");
    }

    [HttpPost("search-dishes")]
    public IQueryable<RecipeModelBase> SearchDishes(string search)
    {
        return recipeRepository.SearchDishes(search);
    }

    [HttpPut("dish")]
    public async Task ImportDish([FromBody] RecipeCreationRequest request)
    {
        await recipeRepository.CreateOrAppendDishAsync(request.Recipe, request.Image);
    }

    [HttpPost]
    public async Task<Guid> CreateRecipe([FromBody] RecipeModel recipe)
    {
        await recipeRepository.CreateRecipeAsync(recipe);
        return recipe.Id;
    }

    [HttpPut("recipe/{recipeId}/image")]
    public async Task<List<string>> AddRecipeImage(Guid recipeId, [FromBody] FoodImageCreationRequest request)
    {
        var path = $@"{DatabaseContext.ImagesBaseUrl}\{request.ImageData.GetHash()}.png";
        await System.IO.File.WriteAllBytesAsync(path, request.ImageData);

        await recipeRepository.AddDishImagesAsync(new()
        {
            ImagePath = path,
            RecipeId = recipeId,
            ThumbHash = request.ThumbData.GetHash(),
            ThumbData = request.ThumbData
        });
        return await recipeRepository.GetAll().Where(x => x.Recipe.Id == recipeId).Select(x => x.ImageHashes)
            .SingleAsync();
    }

    [HttpDelete("recipe/{recipeId}/images/{thumbHash}")]
    public async Task<List<string>> RemoveRecipeImage(Guid recipeId, string thumbHash)
    {
        await context.FoodImages.Where(x => x.RecipeId == recipeId && x.ThumbHash == thumbHash).ExecuteDeleteAsync();
        return await recipeRepository.GetAll().Where(x => x.Recipe.Id == recipeId).Select(x => x.ImageHashes)
            .SingleAsync();
    }

    [HttpPut("{recipeId}/tag")]
    public async Task AddTagAsync(Guid recipeId, [FromBody] FoodTagModel tag)
    {
        tag.RecipeId = recipeId;
        context.Set<FoodTagModel>().Add(tag);
        await context.SaveChangesAsync();
    }

    [HttpDelete("{recipeId}/tag")]
    public async Task RemoveTagAsync(Guid recipeId, [FromBody] FoodTagModel tag)
    {
        tag.RecipeId = recipeId;
        await context.Set<FoodTagModel>().Where(x => x.RecipeId == recipeId && x.Key == tag.Key && x.Value == tag.Value)
            .ExecuteDeleteAsync();
    }

    [HttpPost("{recipeId}/change-type")]
    public async Task ChangeType(Guid recipeId, string type)
    {
        await context.Set<RecipeModelBase>().Where(x => x.Id == recipeId)
            .ExecuteUpdateAsync(query => query.SetProperty(x => x.Type, type));
    }

    [HttpPatch]
    public async Task UpdateRecipeAsync(RecipeModelBase recipe)
    {
        _ = await recipeRepository.GetAsync(recipe.Id) ?? throw new("recipe not found");

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
    public async Task UpsertIngredientAsync(string ingredientName, [FromBody] IngredientModel ingredient)
    {
        if (ingredientName != ingredient.IngredientName) throw new("Ingredients names do not match");
        await recipeRepository.UpsertIngredientAsync(ingredient);
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