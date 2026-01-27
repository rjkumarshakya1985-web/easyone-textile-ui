import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_CONFIG } from '../../config/api.config';

import { SupplierTableResponse } from '../../model/response/supplier/supplier-table-response.model';
import { Transport } from '../../model/transporter.model';
import { ProductHsnCode } from '../../model/response/hsn-code.model';
import { SupplierProductDto } from '../../model/entity/products/supplier-product.model';
import { SupplierProductView } from '../../model/views/supplier-product-view.model';

@Injectable({
  providedIn: 'root'
})
export class AutoCompleteService {

  private readonly baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) apiUrl: string
  ) {
    this.baseUrl = `${apiUrl}autocomplete/`;
  }

  // ---------------- Supplier ----------------
  searchSupplier(search: string) {
    return this.http.get<SupplierTableResponse[]>(
      `${this.baseUrl}supplier-search/${encodeURIComponent(search)}`
    );
  }

  // ---------------- Transport ----------------
  searchOrphanTransport(search: string, supplierId: string) {
    return this.http.get<Transport[]>(
      `${this.baseUrl}orphan-transport-search/${encodeURIComponent(search)}/${supplierId}`
    );
  }

  // ---------------- HSN Code ----------------
  searchHsnCode(search: string) {
    return this.http.get<ProductHsnCode[]>(
      `${this.baseUrl}hsn-code-search/${encodeURIComponent(search)}`
    );
  }

  // ---------------- Supplier Products ----------------
  searchSupplierProduct(search: string) {
    return this.http.get<SupplierProductView[]>(
      `${this.baseUrl}supplier-product-search/${encodeURIComponent(search)}`
    );
  }
}
