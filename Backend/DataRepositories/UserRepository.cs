using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;
using System.Linq.Expressions;

namespace ObscuritasMediaManager.Backend.DataRepositories;

public class UserRepository(DatabaseContext dbContext)
{
    public async Task<UserModel?> LogonAsync(string username, string password)
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(x => x.Name.ToLower() == username.ToLower());
        if (user is null) return null;
        if (password != user.Password.Decrypt()) return null;
        return user;
    }

    public async Task CreateUser(string username, string password)
    {
        var encryptedPassword = password.Encrypt();
        await dbContext.Users.AddAsync(new() { Password = encryptedPassword, Name = username, Id = Guid.NewGuid() });
        await dbContext.SaveChangesAsync();
    }

    public async Task<UserSettingsModel> GetSettingsAsync(Guid userId)
    {
        var settings = await dbContext.UserSettings.FirstOrDefaultAsync(x => x.Id == userId);
        if (settings is not null) return settings;

        settings = new() { Id = userId };
        await dbContext.UserSettings.AddAsync(settings);
        await dbContext.SaveChangesAsync();

        return settings;
    }

    public async Task UpdateUserSettingsAsync(UserSettingsModel updated)
    {
        dbContext.UserSettings.Update(updated);
        await dbContext.SaveChangesAsync();
    }

    public async Task UpdateUserSettingsAsync(Guid userId,
        Expression<Func<SetPropertyCalls<UserSettingsModel>, SetPropertyCalls<UserSettingsModel>>> setCalls)
    {
        await dbContext.UserSettings.Where(x => x.Id == userId).ExecuteUpdateAsync(setCalls);
    }
}