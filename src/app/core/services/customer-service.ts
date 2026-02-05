import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { CustomerResponse } from '../../model/response/customer/customer-response.model';
import { CustomerRequest } from '../../model/request/customer/customer-request.model';
import { TableDataRequest } from '../../model/request/table-datafilter-request.model';
import { TableResult } from '../../model/table-result';
import { Customer } from '../../model/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private apiUrl: string
  ) {
    this.baseUrl = `${this.apiUrl}customer`;
  }

  getCustomerTableData(request: TableDataRequest): Observable<TableResult<CustomerResponse>> {
      return this.http.post<TableResult<CustomerResponse>>(`${this.baseUrl}/table`, request);
    }

  /** GET: api/customer */
  getAll(): Observable<CustomerResponse[]> {
    return this.http.get<CustomerResponse[]>(this.baseUrl);
  }

  /** GET: api/customer/{id} */
  getById(id: string): Observable<CustomerResponse> {
    return this.http.get<CustomerResponse>(`${this.baseUrl}/${id}`);
  }

  /** POST: api/customer */
  create(request: CustomerRequest): Observable<void> {
    return this.http.post<void>(this.baseUrl, request);
  }

  /** PUT: api/customer */
  update(request: CustomerRequest): Observable<void> {
    return this.http.put<void>(this.baseUrl, request);
  }

  /** DELETE: api/customer/{id} */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
   updateStatusCustomer(id:string,actionType:number):Observable<boolean> {
    let request = {customerId:id,ActionType:actionType};
    return this.http.post<boolean>(`${this.apiUrl}customer/update-status-customer`, request);
  }
  getCustomer(CustomerId: string): Observable<Customer> {
     return this.http.get<Customer>(`${this.apiUrl}customer/${CustomerId}`);
    }
  
}
