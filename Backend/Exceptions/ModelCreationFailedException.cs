﻿using System.Collections.Concurrent;

namespace ObscuritasMediaManager.Backend.Exceptions;

public class ModelCreationFailedException<T> : Exception where T : notnull
{
    public ModelCreationFailedException(ConcurrentDictionary<T, string> modelErrors)
        : base(
            $"One or more model failed creating: {string.Join(",\n", modelErrors.Select(x => $"{x.Key}: {x.Value}"))}")
    {
    }

    public ModelCreationFailedException(params T[] failedModels)
        : base($"One or more model failed creating: {string.Join(",\n", failedModels)}")
    {
    }

    public ModelCreationFailedException(IEnumerable<T> failedModels)
        : base($"One or more model failed creating: {string.Join(",\n", failedModels)}")
    {
    }
}