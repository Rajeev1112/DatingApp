using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helper;
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

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes.FirstOrDefaultAsync(x => x.LikerId == userId && x.LikeeId == recipientId);
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

        public async Task<PageList<User>> GetUsers(UserParam userParam)
        {
            var users = _context.Users.Include(x => x.Photos).OrderByDescending(x => x.LastActive).AsQueryable();
            users = users.Where(x => x.Id != userParam.UserId && x.Gender == userParam.Gender);

            if(userParam.Liker)
            {
                var userLikers = await GetUserLikes(userParam.UserId, userParam.Liker, userParam.Likee);
                users = users.Where( x => userLikers.Contains(x.Id));
            }
            if(userParam.Likee)
            {
                var userLikees = await GetUserLikes(userParam.UserId, userParam.Liker, userParam.Likee);
                users = users.Where( x => userLikees.Contains(x.Id));
            }

            if(userParam.MinAge !=18 || userParam.MaxAge !=99)
            {
                var MinDob = DateTime.Now.AddYears(-userParam.MaxAge -1);
                var MaxDob = DateTime.Now.AddYears(-userParam.MinAge -1);
                users = users.Where(x => x.DateOfBirth > MinDob && x.DateOfBirth <MaxDob);
            }
            if(!string.IsNullOrEmpty(userParam.OrderBy))
            {
                if(userParam.OrderBy == "created")
                {
                 users = users.OrderByDescending(x => x.Created);
                }
                else
                {
                    users = users.OrderByDescending(x => x.LastActive);
                }
            }
            return await PageList<User>.CreateAsync(users, userParam.PageNumber, userParam.PageSize);

        }

        public async Task<bool> SaveAll()
        {
            var val = await _context.SaveChangesAsync();
            return val > 0;
        }

        private async Task<IEnumerable<int>> GetUserLikes(int Id, bool liker, bool likee)
        {
            var users = await _context.Users
            .Include(x => x.Likers)
            .Include(x => x.Likees)
            .FirstOrDefaultAsync(x => x.Id == Id);

            if(liker)
            {
                return users.Likers.Where(x => x.LikeeId == Id).Select(x => x.LikerId);
            }
            else
            {
                return users.Likees.Where(x => x.LikerId == Id).Select(x => x.LikeeId);
            }
        }
    }
}