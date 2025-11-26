using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;
using System.Reflection;

namespace ObscuritasMediaManager.Backend.Extensions;

public static class ExpressionExtensions
{
    public static MemberInfo? GetPropertyInfo(this LambdaExpression? propertyExpression)
    {
        if (propertyExpression is null) return null;
        if (propertyExpression.Body is MemberExpression memberExpression) return memberExpression.Member;
        if (propertyExpression.Body is UnaryExpression unaryExpression
            && unaryExpression.Operand is MemberExpression unaryMemberExpression)
            return unaryMemberExpression.Member;
        return null;
    }

    public static string GetPropertyName(this LambdaExpression propertyExpression)
    {
        var memberInfo = propertyExpression.GetPropertyInfo();
        if (memberInfo is null) return "Unset";
        return memberInfo.Name;
    }

    public static void SetPropertyValue<T>(this LambdaExpression propertyExpression, T target, object? value)
    {
        var memberInfo = propertyExpression.GetPropertyInfo();
        if (memberInfo is PropertyInfo propertyInfo)
            propertyInfo.SetValue(target, value);
        else if (memberInfo is FieldInfo fieldInfo)
            fieldInfo.SetValue(target, value);
    }

    public static bool ValueEquals(this LambdaExpression target, LambdaExpression other)
    {
        return target.GetPropertyName() == other.GetPropertyName();
    }
}