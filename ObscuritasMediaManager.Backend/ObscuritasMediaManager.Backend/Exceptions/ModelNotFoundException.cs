using System;

namespace ObscuritasMediaManager.Backend.Exceptions
{
    public class ModelNotFoundException : Exception
    {
        public ModelNotFoundException(params string[] identifiers) :
            base("The requested with the following identifiers could not be found: " +
                 string.Join(",\n", identifiers))
        {
        }
    }
}