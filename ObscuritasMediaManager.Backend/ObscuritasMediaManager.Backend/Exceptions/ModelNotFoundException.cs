using System;

namespace ObscuritasMediaManager.Backend.Exceptions
{
    public class ModelNotFoundException : Exception
    {
        public ModelNotFoundException(Guid guid) :
            base("The requested with the following identifiers could not be found: " + guid)
        {
        }
    }
}