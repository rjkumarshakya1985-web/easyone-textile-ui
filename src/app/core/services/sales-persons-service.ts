import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../../config/api.config';
import { Observable } from 'rxjs';
import { TableDataRequest } from '../../model/request/table-datafilter-request.model';
import { TableResult } from '../../model/table-result';
import { SalePersonResponse } from '../../model/response/sales-persons/sales-persons-response';
import { ApiResponse } from '../../config/api.response';


@Injectable({
  providedIn: 'root'
})
export class SalesPersonService {

  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private apiUrl: string
  ) {
    this.baseUrl = `${this.apiUrl}SalePerson`; // 👈 match backend route
  }

  // ✅ Table (pagination + search + sorting)
  getTableData(request: TableDataRequest): Observable<ApiResponse<TableResult<SalePersonResponse>>> {
  return this.http.post<ApiResponse<TableResult<SalePersonResponse>>>(
    `${this.baseUrl}/table`,
    request
  );
}

  // ✅ Get By Id
  getById(id: string): Observable<ApiResponse<SalePersonResponse>> {
    return this.http.get<ApiResponse<SalePersonResponse>>(`${this.baseUrl}/${id}`);
  }
  // ✅ Get Active (dropdown)
  getActive(): Observable<ApiResponse<SalePersonResponse[]>> {
    return this.http.get<ApiResponse<SalePersonResponse[]>>(`${this.baseUrl}/active`);
  }

  // ✅ Save (Create + Update)
  save(request: SalePersonResponse): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${this.baseUrl}`, request);
  }

  // ✅ Delete (Soft delete)
  delete(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/${id}`);
  }
}