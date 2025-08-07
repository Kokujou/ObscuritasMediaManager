using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Data.Food;
using ObscuritasMediaManager.Backend.Data.Music;
using ObscuritasMediaManager.Backend.Exceptions;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories;

public class RecipeRepository(DatabaseContext databaseContext)
{
    private static readonly List<Measurement> PrimaryMeasurements =
        [Measurement.Mass, Measurement.Size, Measurement.Volume];

    public IQueryable<RecipeModelBase> GetAll()
    {
        return databaseContext.Set<RecipeModelBase>();
    }

    public async Task<RecipeModelBase> GetAsync(Guid id)
    {
        return await databaseContext.Set<RecipeModelBase>().SingleAsync(x => x.Id == id);
    }

    public async Task<FoodImageModel> GetImageAsync(Guid id)
    {
        return await databaseContext.Set<FoodImageModel>().FirstAsync(x => x.RecipeId == id);
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
        databaseContext.Recipes.Update(recipe);
        foreach (var change in databaseContext.ChangeTracker.Entries<IngredientModel>())
            change.State = EntityState.Detached;
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

    public IQueryable<string> GetCookware(string search, int maxItems)
    {
        return databaseContext.Cookware.Select(x => x.Name)
            .Where(cookware => cookware.ToLower().Contains(search.ToLower())).Distinct().Take(maxItems);
    }

    public async Task AddCookwareAsync(RecipeCookwareMappingModel cookware)
    {
        databaseContext.Add(cookware);
        await databaseContext.SaveChangesAsync();
    }

    public async Task DeleteCookwareAsync(Guid recipeId, Guid cookwareId)
    {
        await databaseContext.Set<RecipeCookwareMappingModel>().Where(x => x.Id == cookwareId && x.RecipeId == recipeId)
            .ExecuteDeleteAsync();
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

    public IQueryable<IngredientModel> SearchIngredients(string search, int maxItems)
    {
        var combined = databaseContext.Set<RecipeIngredientMappingModel>()
            .Select(mapping => new
            {
                mapping.IngredientName,
                Category = mapping.Ingredient == null ? IngredientCategory.Miscellaneous : mapping.Ingredient.Category,
                Nation = Language.Unset,
                LowestKnownPrice = "",
                IsFluid = mapping.Unit.Measurement == Measurement.Volume
            })
            .Concat(databaseContext.Set<IngredientModel>().Select(ingredient => new
            {
                ingredient.IngredientName,
                ingredient.Category,
                ingredient.Nation,
                ingredient.LowestKnownPrice,
                ingredient.IsFluid
            }))
            .Select(x => new IngredientModel
            {
                IngredientName = x.IngredientName,
                LowestKnownPrice = x.LowestKnownPrice,
                IsFluid = x.IsFluid,
                Category = x.Category,
                Nation = x.Nation
            });

        return combined
            .Where(x => x.IngredientName.ToLower().Contains(search.ToLower()))
            .GroupBy(x => new { x.IngredientName, x.IsFluid })
            .Select(x => x.First())
            .Take(maxItems)
            .AsQueryable();
    }

    public IQueryable<IngredientModel> GetIngredients()
    {
        return databaseContext.Set<IngredientModel>();
    }

    public async Task UpdateIngredientAsync(IngredientModel ingredient)
    {
        if (await databaseContext.Set<IngredientModel>().AnyAsync(x => x.IngredientName == ingredient.IngredientName))
            databaseContext.Update(ingredient);
        else databaseContext.Add(ingredient);
        await databaseContext.SaveChangesAsync();
    }

    public IQueryable<RecipeModelBase> SearchDishes(string search)
    {
        return databaseContext.Set<RecipeModelBase>().Where(x => x.Title.ToLower().Contains(search.ToLower()));
    }

    public async Task CreateDishAsync(FoodModel dish)
    {
        if (await databaseContext.Set<FoodImageModel>().AnyAsync(x => x.ImageHash == dish.Image.ImageHash))
            throw new ConflictException("Dish already exists!");

        foreach (var tag in dish.Tags) tag.RecipeId = dish.Id;

        databaseContext.Add(dish);
        await databaseContext.SaveChangesAsync();
    }
}