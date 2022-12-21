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

    public async Task<RecipeModel> Get(Guid id)
    {
        return await _context.Recipes.FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task CreateRecipe(RecipeModel recipe)
    {
        await _context.Recipes.AddAsync(recipe);
        await _context.SaveChangesAsync();
    }
}