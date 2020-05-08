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
    [Route("api/user/{userId}/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IDatingRepository _repository;
        private readonly IMapper _mapper;

        public MessagesController(IDatingRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        [HttpGet("{messageId}", Name="GetMessage")]
        public async Task<IActionResult> GetMessage(int messageId, int userId)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
             return Unauthorized();

            var message = await _repository.GetMessage(messageId);

            if(message == null)
             return NotFound();

            return Ok(message);
        }

        [HttpGet]
        public async Task<IActionResult> GetMessagesForUser(int userId,[FromQuery] MessageParam messageParam)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
             return Unauthorized();
            
            messageParam.UserId = userId;

            var messages = await _repository.GetMessagesForUser(messageParam);

            var messagesToReturn = _mapper.Map<IEnumerable<MessageToReturnDto>>(messages);

            Response.AddPagination(messages.PageSize, messages.CurrentPage, messages.TotalCount, messages.TotalPage);

            return Ok(messagesToReturn);
        }

        [HttpGet("thread/{recipientId}")]
        public async Task<IActionResult> GetMessageThread(int recipientId, int userId)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
             return Unauthorized();

            var messages = await _repository.GetMessageThread(userId, recipientId);

            var messageThread = _mapper.Map<IEnumerable<MessageToReturnDto>>(messages);

            return Ok(messageThread);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId, [FromBody]MessageForCreationDto messageForCreationDto)
        {
            var sender = await _repository.GetUser(userId);
            if(sender.Id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
             return Unauthorized();

            messageForCreationDto.SenderId = userId;

            var recipient = await _repository.GetUser(messageForCreationDto.RecipientId);

            if(recipient == null)
             return NotFound("Recipeint Not exists");
             
            var message = _mapper.Map<Message>(messageForCreationDto);

            _repository.Add<Message>(message);
            

            if(await _repository.SaveAll())
            {
                var messageToReturn = _mapper.Map<MessageToReturnDto>(message);
                return CreatedAtRoute("GetMessage", new {messageId = message.Id}, messageToReturn);
            }
             

            throw new System.Exception("Message creation was not successfull");
        }

        [HttpPost("{messageId}")]
        public async Task<IActionResult> deleteMessage(int messageId, int userId)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
             return Unauthorized();

            var messageFromRepo = await _repository.GetMessage(messageId);

            if(messageFromRepo.SenderId == userId)
                messageFromRepo.SenderDeleted = true;

            if(messageFromRepo.RecipientId == userId)
                messageFromRepo.RecipientDeleted = true;

            if(messageFromRepo.SenderDeleted && messageFromRepo.RecipientDeleted )
                _repository.Delete(messageFromRepo);

            if(await _repository.SaveAll())
                return NoContent();

            throw new System.Exception("Message deletion was not successfull");
        }

         [HttpPost("{messageId}/read")]
        public async Task<IActionResult> markMessageAsRead(int messageId, int userId)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
             return Unauthorized();

            var messageFromRepo = await _repository.GetMessage(messageId);

            if(messageFromRepo.RecipientId != userId)
                return Unauthorized();
            
            messageFromRepo.IsRead = true;

            await _repository.SaveAll();
            
            return NoContent();

        }
    }
}