using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helper;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IDatingRepository _datingRepository;
        private readonly IMapper _mapper;

        public UserController(IDatingRepository datingRepository, IMapper mapper)
        {
            _datingRepository = datingRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery]UserParam userParam)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var user = await _datingRepository.GetUser(userId);
            userParam.UserId = userId;
            if(string.IsNullOrEmpty(userParam.Gender))
            {
                userParam.Gender = user.Gender == "male"?"female":"male";
            }
            var users = await _datingRepository.GetUsers(userParam);
            var userListToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);
            Response.AddPagination(users.PageSize, users.CurrentPage, users.TotalCount, users.TotalPage);
            return Ok(userListToReturn);
        }

        [HttpGet("{Id}",Name = "GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _datingRepository.GetUser(id);
            var userToReturn = _mapper.Map<UserForDetailsDto>(user);
            return Ok(userToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto userForUpdateDto)
        {
            if(id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
             return Unauthorized();
            var userFromRepo = await _datingRepository.GetUser(id);
            _mapper.Map(userForUpdateDto, userFromRepo);
            if(await _datingRepository.SaveAll())
                return NoContent();

            throw new Exception($"Udate for {id} is failed.");

        }

        [HttpPost("{id}/like/{recipientId}")]
        public async Task<IActionResult> LikeUser(int id, int recipientId)
        {
            if(id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
             return Unauthorized();

            var like = await _datingRepository.GetLike(id, recipientId);

            if(like != null)
             return BadRequest("You already liked this user");

            if(await _datingRepository.GetUser(recipientId) == null)
                return NotFound();
            
            _datingRepository.Add<Like>(new Like{LikerId = id, LikeeId = recipientId});

            if(await _datingRepository.SaveAll())
                return Ok();
            
            return BadRequest("Fail to like user");
        }
        
    }
}