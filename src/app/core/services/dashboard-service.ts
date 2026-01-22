import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../../config/api.config';
import { Observable } from 'rxjs';
import { GstRuleDto } from '../../model/response/gstrule/gstrule-response.model';
import { SupplierDashboardResponse } from '../../model/response/dashboard/supplier-dashboard';
import { AdminDashboardResponse } from '../../model/response/dashboard/admin-dashboard';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

   private baseUrl: string;

   constructor(private http: HttpClient,
    @Inject(API_CONFIG) private apiUrl: string
   ) 
   {
    this.baseUrl = `${this.apiUrl}dashboard`;
    }

   
   getSupplierDashboard(): Observable<SupplierDashboardResponse> {
        return this.http.get<SupplierDashboardResponse>(`${this.baseUrl}/supplier-dashboard`);
   }

   getAdminDashboard(): Observable<AdminDashboardResponse> {
        return this.http.get<AdminDashboardResponse>(`${this.baseUrl}/admin-dashboard`);
   }

  
}
