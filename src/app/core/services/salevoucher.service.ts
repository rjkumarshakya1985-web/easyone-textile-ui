import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { TableResult } from '../../model/table-result';
import { TableDataRequest } from '../../model/request/table-datafilter-request.model';
import { SaleVoucherTableResponse } from '../../model/response/salevouchers/salevoucher-table-response.model';
import { SaleVoucherRequest } from '../../model/request/salevouchers/salevoucher-request.model';
import { SaleVoucherResponse } from '../../model/response/salevouchers/salevoucher-response.model';


@Injectable({
  providedIn: 'root'
})
export class SaleVoucherService {

  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private apiUrl: string
  ) {
    this.baseUrl = `${this.apiUrl}salevoucher`;
  }

  // 📊 TABLE DATA (Role based filtering handled by backend)
  getTableData(request: TableDataRequest): Observable<TableResult<SaleVoucherTableResponse>> {
    return this.http.post<TableResult<SaleVoucherTableResponse>>(
      `${this.baseUrl}/salevoucher-table`,
      request
    );
  }

   get(supplierId: number): Observable<SaleVoucherResponse> {
     return this.http.get<SaleVoucherResponse>(`${this.baseUrl}/${supplierId}`);
   }

  create(request: SaleVoucherRequest): Observable<boolean> {
        return this.http.post<boolean>(`${this.baseUrl}/create`, request);
    }

  update(request: SaleVoucherRequest): Observable<boolean> {
        return this.http.post<boolean>(`${this.baseUrl}/update`, request);
    }

}
