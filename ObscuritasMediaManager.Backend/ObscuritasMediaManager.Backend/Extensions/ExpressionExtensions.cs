using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace ObscuritasMediaManager.Backend.Extensions;

public static class ExpressionExtensions
{
    public static string GetPropertyName<T, U>(this Expression<Func<T, U>> propertyExpression)
    {
        if (propertyExpression.Body is MemberExpression memberExpression) return memberExpression.Member.Name;
        if ((propertyExpression.Body is UnaryExpression unaryExpression)
            && (unaryExpression.Operand is MemberExpression unaryMemberExpression))
            return unaryMemberExpression.Member.Name;
        return "Unset";
    }

    public static Expression<Func<SetPropertyCalls<TEntity>, SetPropertyCalls<TEntity>>> ToSetPropertyCalls<TEntity, TProperty>(
        this Expression<Func<TEntity, TProperty>> property, TProperty value)
    {
        var setParameter = Expression.Parameter(typeof(SetPropertyCalls<TEntity>), "x");

        var method = typeof(SetPropertyCalls<TEntity>).GetMethods().Where(x => x.Name == "SetProperty").ElementAt(1);
        var call = Expression.Call(
            setParameter,
        method.MakeGenericMethod(typeof(TProperty)),
        property,
        Expression.Constant(value));

        var lambda = Expression.Lambda<Func<SetPropertyCalls<TEntity>, SetPropertyCalls<TEntity>>>(
            call, setParameter);
        return lambda;
    }
}
