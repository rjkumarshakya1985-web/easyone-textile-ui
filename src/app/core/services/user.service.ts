import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { TableDataRequest } from '../../model/request/table-datafilter-request.model';
import { TableResult } from '../../model/table-result';
import { UserResponse } from '../../model/response/users/user-response.model';
import { UserRequest } from '../../model/request/users/user-request.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private apiUrl: string   // 👈 Injecting API URL from app.config.ts
  ) {}

 
  getUsers(request: TableDataRequest): Observable<TableResult<UserResponse>> {
    return this.http.post<TableResult<UserResponse>>(`${this.apiUrl}users/table`, request);
  }

  getUser(id:string):Observable<UserResponse>{
     return this.http.get<UserResponse>(`${this.apiUrl}users/table/${id}`);
  }
  saveUsers(request: UserRequest): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}users`, request);
  }
 
  
   
}
