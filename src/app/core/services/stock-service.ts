import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../../config/api.config';
import { Observable } from 'rxjs';
import { TableDataRequest } from '../../model/request/table-datafilter-request.model';
import { TableResult } from '../../model/table-result';
import { StockTableResponse } from '../../model/response/stocks/stock-table-response.model';
import { StockLedgerList } from '../../layouts/admin-layout/pages/stocks/stock-ledger-list/stock-ledger-list';
import { StockLedgerView } from '../../model/views/stock-ledger-view.model';
import { StockAdjustmentRequest } from '../../model/request/stock/stock-adjustment.model';
import { StockAdjustmentResponse } from '../../model/response/stocks/stock-adjustment-response.model';


@Injectable({
  providedIn: 'root'
})
export class StockService {

  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private apiUrl: string
   ) {
    this.baseUrl = `${this.apiUrl}stock`;
    }

    getTableData(request: TableDataRequest): Observable<TableResult<StockTableResponse>> {
       return this.http.post<TableResult<StockTableResponse>>(`${this.baseUrl}/table`, request);
     }
   
    getStockLedgerTableData(request: TableDataRequest): Observable<TableResult<StockLedgerView>> {
       return this.http.post<TableResult<StockLedgerView>>(`${this.baseUrl}/table-ledger`, request);
     }

    stockAdjustment(request:StockAdjustmentRequest):Observable<boolean>{
      return this.http.post<boolean>(`${this.baseUrl}/adjust`,request);
    }

    getStockAdjustments(id:string):Observable<StockAdjustmentResponse>{
      return this.http.get<StockAdjustmentResponse>(`${this.baseUrl}/adjust-list/${id}`);
    }
   
}
