export interface AppUser
{
    token:string;
    refreshToken:string;
    roleName:string;
    userName:string;
    isLoginFailed:boolean;
    message:string;
}