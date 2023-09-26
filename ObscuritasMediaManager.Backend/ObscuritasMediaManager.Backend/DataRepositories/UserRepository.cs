using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;
using System.Linq.Expressions;

namespace ObscuritasMediaManager.Backend.DataRepositories;

public class UserRepository
{
    private readonly DatabaseContext _dbContext;

    public UserRepository(DatabaseContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<UserModel> LogonAsync(string username, string password)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Name.ToLower() == username.ToLower());
        if (user is null) return null;
        if (password != user.Password.Decrypt()) return null;
        return user;
    }

    public async Task CreateUser(string username, string password)
    {
        var encryptedPassword = password.Encrypt();
        await _dbContext.Users.AddAsync(new UserModel { Password = encryptedPassword, Name = username, Id = Guid.NewGuid() });
        await _dbContext.SaveChangesAsync();
    }

    public async Task<UserSettingsModel> GetSettingsAsync(Guid userId)
    {
        var settings = await _dbContext.UserSettings.FirstOrDefaultAsync(x => x.Id == userId);
        if (settings is not null) return settings;

        settings = new UserSettingsModel { Id = userId };
        await _dbContext.UserSettings.AddAsync(settings);
        await _dbContext.SaveChangesAsync();

        return settings;
    }

    public async Task UpdateUserSettingsAsync(UserSettingsModel updated)
    {
        _dbContext.UserSettings.Update(updated);
        await _dbContext.SaveChangesAsync();
    }

    public async Task UpdateUserSettingsAsync(
        Expression<Func<SetPropertyCalls<UserSettingsModel>, SetPropertyCalls<UserSettingsModel>>> setCalls)
    {
        await _dbContext.UserSettings.ExecuteUpdateAsync(setCalls);
    }
}