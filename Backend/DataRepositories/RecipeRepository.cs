using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories;

public class RecipeRepository(DatabaseContext databaseContext)
{
    public IQueryable<RecipeModel> GetAll()
    {
        return databaseContext.Recipes;
    }

    public async Task<RecipeModel> GetAsync(Guid id)
    {
        return await databaseContext.Recipes.SingleAsync(x => x.Id == id);
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await databaseContext.Recipes.AnyAsync(x => x.Id == id);
    }

    public async Task CreateRecipeAsync(RecipeModel recipe)
    {
        await databaseContext.Recipes.AddAsync(recipe);
        await databaseContext.SaveChangesAsync();
    }

    public async Task UpdateRecipeAsync(RecipeModel recipe)
    {
        databaseContext.Update(recipe);
        await databaseContext.SaveChangesAsync();
    }

    public async Task AddIngredientAsync(RecipeIngredientMappingModel ingredient)
    {
        databaseContext.Add(ingredient);
        await databaseContext.SaveChangesAsync();
    }

    public async Task DeleteIngredientAsync(Guid recipeId, Guid ingredientId)
    {
        await databaseContext.Set<RecipeIngredientMappingModel>()
            .Where(x => x.Id == ingredientId && x.RecipeId == recipeId).ExecuteDeleteAsync();
    }

    public IQueryable<string> GetCookware(string search)
    {
        return databaseContext.Cookware.Select(x => x.Name).Distinct();
    }
}