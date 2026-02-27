import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { TransportRequest } from '../../model/request/transport-add-request.model';
import { TableDataRequest } from '../../model/request/table-datafilter-request.model';
import { Transport } from '../../model/transporter.model';
import { TableResult } from '../../model/table-result';
import { SupplierTableResponse } from '../../model/response/supplier/supplier-table-response.model';
import { SupplierTransportResponse } from '../../model/response/supplier-transport/supplier-trasnport-table-response.model';
import { SupplierHsnCodeRequest, SupplierStockGroupDeleteRequest, SupplierTransportDeleteRequest } from '../../model/request/supplier/supplier-transport-delete-request.model';
import { SupplierRequest } from '../../model/request/supplier/supplier-request.model';
import { Supplier } from '../../model/supplier.model';
import { SupplierStockGroupResponse } from '../../model/response/supplier-stock-group/supplier-stockgroup.response';
import { StockGroup } from '../../model/stock-group.model';
import { SupplierHsnCodeResponse } from '../../model/response/supplier/supplier-hsncode/supplier-hsncode-response.model';
import { ProductHsnCode } from '../../model/response/hsn-code.model';


@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private apiUrl: string   // 👈 Injecting API URL from app.config.ts
  ) {}

  /// Supplier

  getSupplierTableData(request: TableDataRequest): Observable<TableResult<SupplierTableResponse>> {
    return this.http.post<TableResult<SupplierTableResponse>>(`${this.apiUrl}supplier/supplier-table`, request);
  }

  getSupplierCode(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}supplier/supplier-code`);
  }

  createSupplier(request:SupplierRequest):Observable<any> {
    return this.http.post<any>(`${this.apiUrl}supplier/create-supplier`, request);
  }

  getSupplier(supplierId: string): Observable<Supplier> {
   return this.http.get<Supplier>(`${this.apiUrl}supplier/supplier-detail/${supplierId}`);
  }

  getCurrentSupplier()
  {
    return this.http.get<Supplier>(`${this.apiUrl}supplier/current-supplier`);
  }

  /// Supplier Transport
  getSupplierTransportTableData(request: TableDataRequest): Observable<TableResult<SupplierTransportResponse>> {
    return this.http.post<TableResult<SupplierTransportResponse>>(`${this.apiUrl}supplier/supplier-transport-mapping-table`, request);
  }

  deleteSupplierTransport(request:SupplierTransportDeleteRequest):Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}supplier/supplier-transport-delete`, request);
  }

  assignSupplierTransport(supplierId:string,transportId:number):Observable<boolean> {
    let request = {SupplierId:supplierId,TransportId:transportId};
    return this.http.post<boolean>(`${this.apiUrl}supplier/assign-supplier-transport`, request);
  }

  updateStatusSupplier(supplierId:string,actionType:number):Observable<boolean> {
    let request = {SupplierId:supplierId,ActionType:actionType};
    return this.http.post<boolean>(`${this.apiUrl}supplier/update-status-supplier`, request);
  }

  getSupplierTransport(supplierId?: string):Observable<Transport[]>{
       const url = supplierId
      ? `${this.apiUrl}supplier/supplier-transports/${supplierId}`
      : `${this.apiUrl}supplier/supplier-transports`;
       return this.http.get<Transport[]>(url);
  }
  
  /// Stock Group //
    getSupplierStockGroupTableData(request: TableDataRequest): Observable<TableResult<SupplierStockGroupResponse>> {
    return this.http.post<TableResult<SupplierStockGroupResponse>>(`${this.apiUrl}supplier/supplier-stockgroup-mapping-table`, request);
   }
  
   getGetOprhanStockGroup(supplierId:string):Observable<StockGroup[]>
   {
     return this.http.get<StockGroup[]>(`${this.apiUrl}supplier/orphan-stockgroup/${supplierId}`);
   }

   assignSupplierStockGroup(supplierId:string,stockGroupId:number):Observable<boolean> {
    let request = {SupplierId:supplierId,StockGroupId:stockGroupId};
    return this.http.post<boolean>(`${this.apiUrl}supplier/assign-supplier-stockgroup`, request);
  }

   deleteSupplierStockGroup(request:SupplierStockGroupDeleteRequest):Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}supplier/supplier-stockgroup-delete`, request);
  }
   
  getSupplierStockGroups(supplierId?: string): Observable<StockGroup[]> {
    const url = supplierId
      ? `${this.apiUrl}supplier/supplier-stockgroups/${supplierId}`
      : `${this.apiUrl}supplier/supplier-stockgroups`;
   return this.http.get<StockGroup[]>(url);
 }
   /// Hsn Code //
  getSupplierHsnCodeTableData(request: TableDataRequest): Observable<TableResult<SupplierHsnCodeResponse>> {
    return this.http.post<TableResult<SupplierHsnCodeResponse>>(`${this.apiUrl}supplier/supplier-hsncode-mapping-table`, request);
   }
  
   getSupplierOrphanHsnCodes(supplierId:string,categoryId:Number,search:string):Observable<ProductHsnCode[]>
   {
     return this.http.get<ProductHsnCode[]>(`${this.apiUrl}supplier/orphan-hsncode/${supplierId}/${categoryId}/${search}`);
   }

   assignSupplierHsnCode(supplierId:string,stockGroupId:number,hsnCodeId:string):Observable<boolean> {
    let request = {SupplierId:supplierId,StockGroupId:stockGroupId,HsnCodeId:hsnCodeId};
    return this.http.post<boolean>(`${this.apiUrl}supplier/assign-hsncode-stockgroup`, request);
  }

   deleteSupplierHsnCode(request:SupplierHsnCodeRequest):Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}supplier/supplier-hsncode-delete`, request);
  }
   
   getGetSupplierHsnCodes(stockGroupId: number,supplierId?: string): Observable<ProductHsnCode[]> {

    let url = `${this.apiUrl}supplier/supplier-hsncodes/${stockGroupId}`;

    if (supplierId) {
     url += `/${supplierId}`;
    }
  return this.http.get<ProductHsnCode[]>(url);
}



}
