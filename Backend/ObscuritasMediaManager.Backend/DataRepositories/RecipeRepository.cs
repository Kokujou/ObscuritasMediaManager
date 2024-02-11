using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories;

public class RecipeRepository
{
    private readonly DatabaseContext _context;

    public RecipeRepository(DatabaseContext databaseContext)
    {
        _context = databaseContext;
    }

    public IQueryable<RecipeModel> GetAll()
    {
        return _context.Recipes;
    }

    public async Task<RecipeModel> GetAsync(Guid id)
    {
        return await _context.Recipes.FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Recipes.AnyAsync(x => x.Id == id);
    }

    public async Task CreateRecipe(RecipeModel recipe)
    {
        await _context.Recipes.AddAsync(recipe);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateRecipe(RecipeModel recipe)
    {
        _context.Update(recipe);
        await _context.SaveChangesAsync();
    }
}