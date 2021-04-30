using System;

namespace ObscuritasMediaManager.Backend.Exceptions
{
    public class ModelCreationFailedException<T> : Exception
    {
        public ModelCreationFailedException(params T[] failedModels) : base("One or more model failed creating: " +
                                                                            string.Join(",\n", failedModels))
        {
        }
    }
}