using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;
        private readonly IConfiguration _config;

        public AuthController(IAuthRepository authRepository, IConfiguration config)
        {
            _authRepository = authRepository;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegistrationDto userForRegistration)
        {

            userForRegistration.UserName = userForRegistration.UserName.ToLower();

            if(await _authRepository.UserExists(userForRegistration.UserName))
                return BadRequest("User Already Exists");
            
            var UserToCreate = new User{UserName = userForRegistration.UserName};
            
            var CreatedUser = await _authRepository.Register(UserToCreate, userForRegistration.Password);

            return StatusCode(201);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
            var user = await _authRepository.Login(userForLoginDto.Username.ToLower(), userForLoginDto.Password);

            if(User == null)
              return Unauthorized();

            var claims = new []
            {
                new Claim(ClaimTypes.NameIdentifier,user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = cred

            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new{
                token1 = tokenHandler.WriteToken(token)
            });

        }
    }
}