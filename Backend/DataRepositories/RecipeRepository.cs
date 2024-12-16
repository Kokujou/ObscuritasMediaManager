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

    public async Task CreateRecipe(RecipeModel recipe)
    {
        await databaseContext.Recipes.AddAsync(recipe);
        await databaseContext.SaveChangesAsync();
    }

    public async Task UpdateRecipe(RecipeModel recipe)
    {
        databaseContext.Update(recipe);
        await databaseContext.SaveChangesAsync();
    }

    public IQueryable<string> GetCookware(string search)
    {
        return databaseContext.Cookware.Select(x => x.Name).Distinct();
    }
}