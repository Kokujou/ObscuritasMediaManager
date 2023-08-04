using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Principal;

namespace ObscuritasMediaManager.Backend.Models;

[Table("Users", Schema = "dbo")]
public class UserModel : IIdentity
{
    public Guid Id { get; set; }
    public string Password { get; set; }
    public string Name { get; set; }
    [NotMapped] public string AuthenticationType => "basic";

    [NotMapped] public bool IsAuthenticated => true;
}