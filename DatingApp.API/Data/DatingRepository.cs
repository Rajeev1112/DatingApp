using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;

        public DatingRepository(DataContext context)
        {
            _context = context;
        }
        public void Add<T>(T entiry) where T : class
        {
            _context.Add(entiry);
        }

        public void Delete<T>(T entiry) where T : class
        {
            _context.Remove(entiry);
        }

        public async Task<Photo> GetMainPhoto(int userId)
        {
            return await _context.Photos.Where(u => u.UserId == userId).FirstOrDefaultAsync(p => p.IsMain);
        }

        public async Task<Photo> GetPhoto(int Id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(x => x.Id == Id);
            return photo;
        }

        public async Task<User> GetUser(int Id)
        {
            var user = await _context.Users.Include(x => x.Photos).FirstOrDefaultAsync(x => x.Id == Id);
            return user;
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            var users = await _context.Users.Include(x => x.Photos).ToListAsync();
            return users;

        }

        public async Task<bool> SaveAll()
        {
            var val = await _context.SaveChangesAsync();
            return val > 0;
        }
    }
}