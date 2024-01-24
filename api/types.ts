export interface Post {
    userId?: number | null;
    id?: PostId;
    title?: string | null;
    body?: string | null;
}

export type PostId = string | string[] | number

export interface Comment {
    postId?: number | null;
    id?: number | null;
    name?: string | null;
    email?: string | null;
    body?: string | null;
}
export interface Pagination {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
}

export interface PostFilters extends Pagination{
    sort: string | null
}
export interface CommentFilters extends Pick<Pagination, 'page' | 'perPage'>{}