export interface UserRequest {
  id: string;                  // Guid -> string
  roleId: number;
  userName: string;
  password: string;
  email?: string | null;
  phone?: string | null;
  isActive: boolean;
  isDeveloper: boolean;
}
