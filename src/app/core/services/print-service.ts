import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../../config/api.config';
import { Observable } from 'rxjs';
import { SaleVoucherPrintResponse } from '../../model/response/print/salevoucher-response-print';


@Injectable({
  providedIn: 'root'
})
export class PrintService {

  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private apiUrl: string
   ) {
    this.baseUrl = `${this.apiUrl}print`;
    }

   
   supplierStickerSaleVoucherParcelPrint(saleVoucherId:number): Observable<SaleVoucherPrintResponse> {
        return this.http.get<SaleVoucherPrintResponse>(`${this.baseUrl}/${saleVoucherId}`);
      }

    
}
