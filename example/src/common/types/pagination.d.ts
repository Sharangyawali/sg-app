export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface PaginationMeta {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface RequestPagination {
  page?: number;
  limit?: number;
}

export type ResponsePagination<T> = {
  data: T[];
  page: number;
  count: number;
  total: number;
  next: number | null;
  prev: number | null;
};
