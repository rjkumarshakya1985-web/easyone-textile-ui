import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { LoginRequest } from '../../model/login.model';
import { AppUser } from '../../model/app-user.model';
import { LocalStorageService } from './local-storage.service';
import { SKIP_INTERCEPTOR } from '../interceptors/jwt.interceptor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private storage: LocalStorageService,
    @Inject(API_CONFIG) private apiUrl: string 
  ) {}

  login(data: LoginRequest): Observable<AppUser> {
    return this.http.post<AppUser>(`${this.apiUrl}auth/login`, data);
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.storage.getRefreshToken();

   return this.http.post(
    `${this.apiUrl}auth/refresh`,
    { refreshToken },
    {
      context: new HttpContext().set(SKIP_INTERCEPTOR, true)
    }
  );
  }
}
