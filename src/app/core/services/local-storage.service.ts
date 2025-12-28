import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {

  private TOKEN_KEY = 'app_token_textile';
  private REFRESH_TOKEN_KEY = "app_refresh_token_textile"
  private USER_KEY = 'app_user';
  private REMEMBER_KEY = 'rememberMe';

  // Save Token
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Get Token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Remove Token
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  setRefreshToken(token: string) {
  localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
}

getRefreshToken(): string | null {
  return localStorage.getItem(this.REFRESH_TOKEN_KEY);
}

removeRefreshToken() {
  localStorage.removeItem(this.REFRESH_TOKEN_KEY);
}

 setTokens(token: string, refresh: string) {
    this.setToken(token);
    this.setRefreshToken(refresh);
  }
  // Save User (Optional)
  setUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): any {
    const data = localStorage.getItem(this.USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  // Remember Me
  setRememberMe(value: boolean): void {
    localStorage.setItem(this.REMEMBER_KEY, JSON.stringify(value));
  }

  getRememberMe(): boolean {
    return localStorage.getItem(this.REMEMBER_KEY) === 'true';
  }

  clearAll(): void {
    this.removeToken();
    this.removeRefreshToken();
    this.removeUser();
  }
}
