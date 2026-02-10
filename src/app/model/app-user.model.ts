export interface AppUser
{
    token:string;
    refreshToken:string;
    roleName:string;
    userName:string;
    name:string;
    isLoginFailed:boolean;
    message:string;
}