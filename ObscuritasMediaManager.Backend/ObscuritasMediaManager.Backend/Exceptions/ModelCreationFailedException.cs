using System;
using System.Collections.Generic;

namespace ObscuritasMediaManager.Backend.Exceptions
{
    public class ModelCreationFailedException<T> : Exception
    {
        public ModelCreationFailedException(params T[] failedModels) : base("One or more model failed creating: " +
                                                                            string.Join(",\n", failedModels))
        {
        }

        public ModelCreationFailedException(IEnumerable<T> failedModels) : base("One or more model failed creating: " +
            string.Join(",\n", failedModels))
        {
        }
    }
}