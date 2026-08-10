export interface AppUser
{
    token:string;
    refreshToken:string;
    roleName:string;
    userName:string;
    name:string;
    isDeveloper:boolean;
    mustChangePassword:boolean;
    isLoginFailed:boolean;
    message:string;
}
