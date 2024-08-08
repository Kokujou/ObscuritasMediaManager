namespace ObscuritasMediaManager.Backend.Attributes;

public class TranslationAttribute(string translation) : Attribute
{
    public string Translation { get; set; } = translation;
}