import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { CustomerResponse } from '../../model/response/customer/customer-response.model';
import { CustomerRequest } from '../../model/request/customer/customer-request.model';
import { TableDataRequest } from '../../model/request/table-datafilter-request.model';
import { TableResult } from '../../model/table-result';
import { Visitors } from '../../model/visitors.model';
import { VisitorResponse } from '../../model/response/visitor/visitor-response.model';
import { VisitorsReuest } from '../../model/request/Visitor/visitor-request.model';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {

  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private apiUrl: string
  ) {
    this.baseUrl = `${this.apiUrl}visitor`;
  }

  getVisitorTableData(request: TableDataRequest): Observable<TableResult<VisitorResponse>> {
      return this.http.post<TableResult<VisitorResponse>>(`${this.baseUrl}/table`, request);
    }

  /** GET: api/visitor */
  getAll(): Observable<VisitorResponse[]> {
    return this.http.get<VisitorResponse[]>(this.baseUrl);
  }

  /** GET: api/visitor/{id} */
  getById(id: string): Observable<VisitorResponse> {
    return this.http.get<VisitorResponse>(`${this.baseUrl}/${id}`);
  }

  /** POST: api/visitor */
  create(request: VisitorsReuest): Observable<void> {
    return this.http.post<void>(this.baseUrl, request);
  }

  /** PUT: api/visitor */
  update(id: string,request:VisitorsReuest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, request);
  }

  /** DELETE: api/customer/{id} */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
   
  getVisitor(VisitorId: string): Observable<Visitors> {
     return this.http.get<Visitors>(`${this.apiUrl}visitor/${VisitorId}`);
    }
  
}
