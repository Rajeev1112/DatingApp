using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Helper
{
    public class PageList<T> : List<T>
    {
        public int PageSize { get; set; }

        public int CurrentPage { get; set; }
        public int TotalCount { get; set; }
        public int TotalPage { get; set; }

        public PageList(List<T> items, int count, int pageSize, int pageNumber)
        {
            TotalCount = count;
            AddRange(items);
            PageSize = pageSize;
            CurrentPage = pageNumber;
            TotalPage = (int)Math.Ceiling( count/ (double) pageSize);
        }

        public static async Task<PageList<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize)
        {
            int count = source.Count();
            var items = await source.Skip((pageNumber-1)*pageSize).Take(pageSize).ToListAsync();
            return new PageList<T>(items, count, pageSize, pageNumber);
        }
    }
}