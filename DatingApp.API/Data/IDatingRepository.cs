using System.Collections.Generic;
using System.Threading.Tasks;
using DatingApp.API.Helper;
using DatingApp.API.Models;

namespace DatingApp.API.Data
{
    public interface IDatingRepository
    {
         void Add<T>(T entiry) where T : class;
         void Delete<T>(T entiry) where T: class;

         Task<bool> SaveAll();
         Task<PageList<User>> GetUsers(UserParam userParam);
         Task<User> GetUser(int Id);

         Task<Photo> GetPhoto(int Id);

         Task<Photo> GetMainPhoto(int userId);
         
    }
}