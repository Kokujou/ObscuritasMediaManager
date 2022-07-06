using System;
using System.Collections.Generic;
using System.Linq;

namespace ObscuritasMediaManager.Backend.Exceptions;

public class ModelCreationFailedException<T> : Exception
{
    public ModelCreationFailedException(Dictionary<T, string> modelErrors) : base(
        $"One or more model failed creating: {string.Join(",\n", modelErrors.Select(x => $"{x.Key}: {x.Value}"))}")
    {
    }

    public ModelCreationFailedException(params T[] failedModels) : base("One or more model failed creating: " +
                                                                        string.Join(",\n", failedModels))
    {
    }

    public ModelCreationFailedException(IEnumerable<T> failedModels) : base("One or more model failed creating: " +
                                                                            string.Join(",\n", failedModels))
    {
    }
}