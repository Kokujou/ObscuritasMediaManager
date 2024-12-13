﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

        await recipeRepository.CreateRecipe(recipe);
        return recipe.Id!.Value;
    }

    [HttpPatch]
    public async Task UpdateRecipeAsync(RecipeModel recipe)
    {
        if (!await recipeRepository.ExistsAsync(recipe.Id!.Value)) throw new("recipe not found");

        await recipeRepository.UpdateRecipe(recipe);
    }

    [HttpPost("cookware/search")]
    public IQueryable<string> SearchCookwareAsync([FromBody] string search)
    {
        return recipeRepository.GetCookware(search);
    }
}