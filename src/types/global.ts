export interface ApiResponse<T> {
 data: T;
 message: string;
 success: boolean;
}

export interface User {
 id: string;
 email: string;
 name: string;
}
