namespace DatingApp.API.Helper
{
    public class UserParam
    {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;

        private int pageSize = 10;
        public int PageSize
        {
            get { return pageSize; }
            set 
            { 
                pageSize = value > MaxPageSize? MaxPageSize:value; 
            }
        }
        
        public int UserId { get; set; }
        public string Gender { get; set; }
        public int MinAge { get; set; } = 18;
        public int MaxAge { get; set; } = 99;
        public string OrderBy { get; set; }
        public bool Likee { get; set; } = false;
        public bool Liker { get; set; } = false;
    }
}