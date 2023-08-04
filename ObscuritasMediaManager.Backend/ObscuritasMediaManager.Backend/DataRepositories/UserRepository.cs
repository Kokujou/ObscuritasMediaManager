using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;

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
}