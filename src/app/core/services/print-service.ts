import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../../config/api.config';
import { Observable } from 'rxjs';
import { SaleVoucherPrintDetailSetting, SaleVoucherPrintResponse, StickerPrint, StickerPrintSetting } from '../../model/response/print/salevoucher-response-print';


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

   productBarcodeSticker(id:string,isSaleVoucher?: boolean): Observable<StickerPrint> {
          let url = `${this.baseUrl}/product-barcode-sticker/${id}`;
          if (isSaleVoucher !== undefined) {
               url += `?isSaleVoucher=${isSaleVoucher}`;
            }
          
        return this.http.get<StickerPrint>(url);
      }

   getStickerSetting(): Observable<StickerPrintSetting> {
        return this.http.get<StickerPrintSetting>(`${this.apiUrl}stickerprintsetting`);
      }

   saveStickerSetting(request: StickerPrintSetting): Observable<boolean> {
        return this.http.post<boolean>(`${this.apiUrl}stickerprintsetting`, request);
      }

   getSaleVoucherPrintDetail(): Observable<SaleVoucherPrintDetailSetting> {
        return this.http.get<SaleVoucherPrintDetailSetting>(`${this.apiUrl}salevoucherprintdetail`);
      }

   saveSaleVoucherPrintDetail(request: SaleVoucherPrintDetailSetting): Observable<boolean> {
        return this.http.post<boolean>(`${this.apiUrl}salevoucherprintdetail`, request);
      }
    
}
