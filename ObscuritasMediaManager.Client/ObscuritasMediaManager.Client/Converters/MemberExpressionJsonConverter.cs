using System;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace ObscuritasMediaManager.Client.Converters;

class MemberExpressionJsonConverter : JsonConverter<Expression>
{
    public override bool CanConvert(Type typeToConvert)
    {
        if (typeToConvert.BaseType == typeof(LambdaExpression)) return true;
        return base.CanConvert(typeToConvert);
    }

    public override Expression? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var memberName = reader.GetString() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(memberName)) return null;

        var type = typeToConvert.GenericTypeArguments[0].GenericTypeArguments[0];
        var parameter = Expression.Parameter(type, "p");
        var valueType = typeToConvert.GenericTypeArguments[0].GenericTypeArguments[1];
        var member = Expression.Convert(Expression.PropertyOrField(parameter, memberName), valueType);
        return Expression.Lambda(typeToConvert.GenericTypeArguments[0], member, parameter);
    }

    public override void Write(Utf8JsonWriter writer, Expression value, JsonSerializerOptions options)
    {
        if (value is null)
        {
            writer.WriteRawValue("null");
            return;
        }

        if (value is not LambdaExpression ex) 
            throw new NotSupportedException("Die Expression muss eine einfache MemberExpression sein!");

        var memberName = ex.GetPropertyName();
        if (memberName == "Unset")
            throw new NotSupportedException("Die Expression muss eine einfache MemberExpression sein!");

        writer.WriteStringValue(memberName);
    }
}
