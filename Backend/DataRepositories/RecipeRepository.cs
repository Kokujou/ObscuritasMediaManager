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

    public async Task DeleteRecipeAsync(Guid recipeId, bool hard = false)
    {
        bool single;
        if (hard) single = await databaseContext.Recipes.CountAsync(x => x.Id == recipeId && x.Deleted) == 1;
        else single = await databaseContext.Recipes.CountAsync(x => x.Id == recipeId && !x.Deleted) == 1;

        if (!single)
            throw new(
                $"Recipe not found or not available for specified delete action. Action: {(hard ? "Hard" : "Soft")} Delete.");

        if (hard)
            await databaseContext.Recipes.Where(x => x.Id == recipeId && x.Deleted).ExecuteDeleteAsync();
        else
            await databaseContext.Recipes.Where(x => x.Id == recipeId && !x.Deleted)
                .ExecuteUpdateAsync(x => x.SetProperty(y => y.Deleted, true));
    }

    public async Task UndeleteRecipeAsync(Guid recipeId)
    {
        if (await databaseContext.Recipes.CountAsync(x => x.Id == recipeId && x.Deleted) != 1)
            throw new("Recipe not found or not deleted.");

        await databaseContext.Recipes.Where(x => x.Id == recipeId && x.Deleted)
            .ExecuteUpdateAsync(x => x.SetProperty(y => y.Deleted, false));
    }

    public IQueryable<RecipeIngredientMappingModel> SearchItems(string search, int maxItems)
    {
        return databaseContext.Set<RecipeIngredientMappingModel>()
            .Where(x => x.IngredientName.ToLower().Contains(search.ToLower()))
            .Take(maxItems);
    }
}