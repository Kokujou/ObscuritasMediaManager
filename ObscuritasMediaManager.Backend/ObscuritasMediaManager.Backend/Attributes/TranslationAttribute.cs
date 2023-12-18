
namespace ObscuritasMediaManager.Backend.Attributes;

public class TranslationAttribute : Attribute
{
    public string Translation { get; set; }

    public TranslationAttribute(string translation)
    {
        Translation = translation;
    }
}
