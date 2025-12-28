import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { TransportRequest } from '../../model/request/transport-add-request.model';
import { TableDataRequest } from '../../model/request/table-datafilter-request.model';
import { Transport } from '../../model/transporter.model';
import { TableResult } from '../../model/table-result';


@Injectable({
  providedIn: 'root'
})
export class TransportService {

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private apiUrl: string   // 👈 Injecting API URL from app.config.ts
  ) {}

  add(request: TransportRequest): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}transport/add`, request);
  }
  
  get(id: number): Observable<Transport> {
  return this.http.get<Transport>(`${this.apiUrl}transport/${id}`);
  }
  getTableData(request: TableDataRequest): Observable<TableResult<Transport>> {
    return this.http.post<TableResult<Transport>>(`${this.apiUrl}transport/table`, request);
  }
}
