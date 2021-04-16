using System;
using System.Collections.Generic;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories.Interfaces
{
    public interface IGenreRepository : IDisposable
    {
        public IEnumerable<Genre> GetAll();
    }
}