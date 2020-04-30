namespace DatingApp.API.Helper
{
    public class PaginationHeader
    {
        public int PageSize { get; set; }

        public int CurrentPage { get; set; }
        public int TotalCount { get; set; }
        public int TotalPage { get; set; }

        public PaginationHeader(int pageSize, int currentPage, int totalCount, int totalPage)
        {
            PageSize = pageSize;
            CurrentPage = currentPage;
            TotalCount = totalCount;
            TotalPage = totalPage;
        }
    }
}