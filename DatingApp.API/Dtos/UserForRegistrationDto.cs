using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.Dtos
{
    public class UserForRegistrationDto
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        [StringLength(8, MinimumLength=4, ErrorMessage="Password must be between 4 to 8 character long")]
        public string Password { get; set; }
    }
}