import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { AdminMenuSetting, AdminMenuSettingRequest } from '../../model/admin-menu-setting.model';

@Injectable({
  providedIn: 'root'
})
export class AdminMenuService {
  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private apiUrl: string
  ) {}

  getSettings(): Observable<AdminMenuSetting[]> {
    return this.http.get<AdminMenuSetting[]>(`${this.apiUrl}adminmenu`);
  }

  saveSettings(request: AdminMenuSettingRequest): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}adminmenu`, request);
  }
}
