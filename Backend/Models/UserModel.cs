using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Principal;

namespace ObscuritasMediaManager.Backend.Models;

[Table("Users")]
public class UserModel : IIdentity
{
    public Guid Id { get; set; }
    [MaxLength(255)] public required string Password { get; set; }
    [MaxLength(255)] public required string Name { get; set; }
    [NotMapped] public string AuthenticationType => "basic";

    [NotMapped] public bool IsAuthenticated => true;
}