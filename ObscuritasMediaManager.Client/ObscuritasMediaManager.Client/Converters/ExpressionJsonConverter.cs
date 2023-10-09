using Serialize.Linq.Serializers;
using System;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace ObscuritasMediaManager.Client.Converters;

class ExpressionJsonConverter : JsonConverter<Expression>
{
    public override bool CanConvert(Type typeToConvert)
    {
        if (typeToConvert.BaseType == typeof(LambdaExpression)) return true;
        return base.CanConvert(typeToConvert);
    }

    public override Expression? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        using var jsonDoc = JsonDocument.ParseValue(ref reader);
        var serialized = jsonDoc.RootElement.GetRawText();

        if (serialized == "null") return null;
        var serializer = new ExpressionSerializer(new Serialize.Linq.Serializers.JsonSerializer());
        return serializer.DeserializeText(serialized);
    }

    public override void Write(Utf8JsonWriter writer, Expression value, JsonSerializerOptions options)
    {
        if (value is null)
        {
            writer.WriteRawValue("null");
            return;
        }

        var serializer = new ExpressionSerializer(new Serialize.Linq.Serializers.JsonSerializer());
        var serialized = serializer.SerializeText(value);
        writer.WriteRawValue(serialized);
    }
}
