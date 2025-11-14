using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Data.Food;
using ObscuritasMediaManager.Backend.Data.Music;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class InventoryController(DatabaseContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<InventoryItemModel[]> GetInventory()
    {
        return await dbContext.Inventory.ToArrayAsync();
    }

    [HttpPatch]
    public async Task UpdateItem([FromBody] InventoryItemModel item)
    {
        dbContext.Update(item);
        await dbContext.SaveChangesAsync();
    }

    [HttpPut]
    public async Task AddItem(InventoryItemModel item)
    {
        item.ItemId = Guid.NewGuid();
        item.Ingredient = null;
        item.IngredientName = item.IngredientName.Trim();

        var relatedIngredient =
            await dbContext.Set<IngredientModel>().FirstOrDefaultAsync(x => x.IngredientName == item.IngredientName);
        if (relatedIngredient is null)
        {
            dbContext.Add(new IngredientModel
            {
                IngredientName = item.IngredientName,
                LowestKnownPrice = "",
                Category = IngredientCategory.Miscellaneous,
                Nation = Language.Unset
            });
            await dbContext.SaveChangesAsync();
        }

        dbContext.Inventory.Add(item);
        await dbContext.SaveChangesAsync();
    }

    [HttpPost("item/{itemId:guid}/multiply/{times:int}")]
    public async Task MultiplyItemAsync(Guid itemId, int times)
    {
        var template = await dbContext.Inventory.FirstAsync(x => x.ItemId == itemId);

        for (var i = 0; i < times; i++)
            dbContext.Inventory.Add(new()
            {
                ItemId = Guid.NewGuid(),
                IngredientName = template.IngredientName,
                Quantity = template.Quantity,
                Target = template.Target,
                IsSide = template.IsSide,
                Level = template.Level,
                Unit = new()
                {
                    Name = template.Unit.Name,
                    ShortName = template.Unit.ShortName,
                    Measurement = template.Unit.Measurement,
                    Multiplier = template.Unit.Multiplier
                }
            });

        await dbContext.SaveChangesAsync();
    }

    [HttpDelete("{itemId:guid}")]
    public async Task DeleteItem(Guid itemId)
    {
        await dbContext.Inventory.Where(x => x.ItemId == itemId).ExecuteDeleteAsync();
    }
}