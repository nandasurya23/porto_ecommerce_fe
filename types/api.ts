export type ApiMeta = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};

export type ApiErrorItem = {
  field?: string;
  message: string;
};

export type ApiResponse<T> = {
  success: true;
  message: string;
  data: T;
  meta?: ApiMeta;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  errors?: ApiErrorItem[];
};

export type ApiEnvelope<T> = ApiResponse<T> | ApiErrorResponse;
