export interface UserResponse {
  id: string;          // Guid → string
  role: number;      // enum stays enum
  userName: string;
  password: string;
  email?: string;      // nullable → optional
  phone?: string;      // nullable → optional
  isActive: boolean;
  isDeveloper: boolean;
  userDetail?: UserDetailResponse;
}

 export interface UserDetailResponse {
  id: string;
  userId: string;
  departmentId?: number;
}
