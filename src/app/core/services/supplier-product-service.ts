import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { TableResult } from '../../model/table-result';
import { SupplierProductDto } from '../../model/entity/products/supplier-product.model';
import { TableDataRequest } from '../../model/request/table-datafilter-request.model';
import { SupplierProductRequest } from '../../model/request/product/supplier-product-request.model';


@Injectable({
  providedIn: 'root'
})
export class SupplierProductService {

  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private apiUrl: string
  ) {
    this.baseUrl = `${this.apiUrl}SupplierProduct`;
  }

  // 📊 TABLE DATA (Role based filtering handled by backend)
  getTableData(request: TableDataRequest): Observable<TableResult<SupplierProductDto>> {
    return this.http.post<TableResult<SupplierProductDto>>(
      `${this.baseUrl}/supplier-product-table`,
      request
    );
  }

  // 📄 GET ALL
  getAll(): Observable<SupplierProductDto[]> {
    return this.http.get<SupplierProductDto[]>(this.baseUrl);
  }

  // 🔍 GET BY ID
  getById(id: string): Observable<SupplierProductDto> {
    return this.http.get<SupplierProductDto>(`${this.baseUrl}/${id}`);
  }

  // 🔍 GET BY ID
  getProductViewById(id: string): Observable<SupplierProductDto> {
    return this.http.get<SupplierProductDto>(`${this.baseUrl}/product-view/${id}`);
  }

  getCode(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fetch-code`);
  }

  // ➕ CREATE
  create(request: SupplierProductRequest): Observable<boolean> {
    return this.http.post<boolean>(this.baseUrl, request);
  }

  // ✏️ UPDATE
  update(request: SupplierProductRequest): Observable<boolean> {
    return this.http.put<boolean>(this.baseUrl, request);
  }

  // 🗑 DELETE
  delete(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/${id}`);
  }

  // 🔄 TOGGLE ACTIVE
  toggleActive(id: string): Observable<boolean> {
    return this.http.patch<boolean>(
      `${this.baseUrl}/${id}/toggle-active`,
      {}
    );
  }
}
