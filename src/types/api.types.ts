export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T | null;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    [key: string]: any;
  } | null;
}
