using System;
using System.Linq;
using System.Linq.Expressions;

namespace ObscuritasMediaManager.Client.Extensions;

public static class ReflectionExtensions
{
    public static string GetPropertyName<T, U>(this Expression<Func<T, U>> propertyExpression)
    {
        if (propertyExpression.Body is MemberExpression memberExpression) return memberExpression.Member.Name;
        if ((propertyExpression.Body is UnaryExpression unaryExpression)
            && (unaryExpression.Operand is MemberExpression unaryMemberExpression))
            return unaryMemberExpression.Member.Name;
        return "Unset";
    }
}
