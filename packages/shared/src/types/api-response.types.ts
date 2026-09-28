export type PaginationMeta = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export interface ApiResponse<T> {
    success: true;
    message?: string;
    data: T;
    pagination?: PaginationMeta;
}


