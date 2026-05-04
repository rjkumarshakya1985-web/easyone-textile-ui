import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { TableResult } from '../../model/table-result';
import { TableDataRequest } from '../../model/request/table-datafilter-request.model';
import { SaleVoucherTableResponse } from '../../model/response/salevouchers/salevoucher-table-response.model';
import { SaleVoucherRequest } from '../../model/request/salevouchers/salevoucher-request.model';
import { SaleVoucherResponse } from '../../model/response/salevouchers/salevoucher-response.model';
import { SaleVoucherStatusView } from '../../model/response/salevouchers/salevoucher-status-response.model';
import { SaleVoucherDto } from '../../model/dto/sale-voucher.model';
import { LrRequest } from '../../model/request/salevouchers/lr-request.model';


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

  delete(id: number): Observable<boolean> {
  return this.http.delete<boolean>(`${this.baseUrl}/${id}`);
}
  getAllSaleVoucherStatus(saleVoucher:number):Observable<SaleVoucherStatusView[]>
  {
     return this.http.get<SaleVoucherStatusView[]>(`${this.apiUrl}salevoucherstatus/${saleVoucher}`);
  }

 markAsExported(id: number): Observable<SaleVoucherDto> {
  return this.http.put<SaleVoucherDto>(`${this.baseUrl}/${id}`, {});
 }

getExportedList(): Observable<SaleVoucherDto[]> {
   return this.http.get<SaleVoucherDto[]>(`${this.baseUrl}/export`);
}

saveLr(request:LrRequest):Observable<boolean>{
 return this.http.post<boolean>(`${this.baseUrl}/lr`, request);
}

}
