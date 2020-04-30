using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace DatingApp.API.Helper
{
    public static class Extensions
    {
        public static void AddApplicationError(this HttpResponse response, string message)
        {
            response.Headers.Add("Application-Error", message);
            response.Headers.Add("Access-Control-Ex-Header", "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");
        }

        public static void AddPagination(this HttpResponse response, int pageSize, int currentPage, int totalCount, int totalPage)
        {
            response.Headers.Add("Pagination", 
            JsonConvert.SerializeObject(new PaginationHeader(pageSize, currentPage, totalCount, totalPage)));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }

        public static int CalculateAge(this DateTime dateOfBirth)
        {
            var age = DateTime.Today.Year - dateOfBirth.Year;
            if(dateOfBirth.AddYears(age) > DateTime.Today)
                age--;
            return age;
        }
    }
}