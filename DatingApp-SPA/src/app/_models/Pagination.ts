export interface Pagination {
    CurrentPage: number;
    PageSize: number;
    TotalCount: number;
    TotalPage: number;
}

export class PaginatedResult<T> {
    result: T;
    pagination: Pagination;
}
