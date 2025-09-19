export interface ApiError {
 message: string;
 error?: {
  issues: Array<{
   code: string;
   expected?: string;
   received?: string;
   path: string[];
   message: string;
  }>;
  name: string;
 };
 success?: boolean;
}

export interface ApiResponse<T = unknown> {
 data: T;
 message?: string;
}
