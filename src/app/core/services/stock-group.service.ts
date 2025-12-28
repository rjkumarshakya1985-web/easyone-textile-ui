import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { StockGroup } from '../../model/stock-group.model';
import { StockGroupRequest } from '../../model/request/stock-group/stock-group-request.model';

@Injectable({
  providedIn: 'root'
})
export class StockGroupService {

  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private apiUrl: string
  ) {
    this.baseUrl = `${this.apiUrl}StockGroup`;
  }

  /** GET: api/StockGroup */
  getAll(): Observable<StockGroup[]> {
    return this.http.get<StockGroup[]>(this.baseUrl);
  }

  /** GET: api/StockGroup/{id} */
  getById(id: number): Observable<StockGroup> {
    return this.http.get<StockGroup>(`${this.baseUrl}/${id}`);
  }

  /** POST: api/StockGroup */
  create(request: StockGroupRequest): Observable<void> {
    return this.http.post<void>(this.baseUrl, request);
  }

  /** PUT: api/StockGroup */
  update(request: StockGroupRequest): Observable<void> {
    return this.http.put<void>(this.baseUrl, request);
  }

  /** DELETE: api/StockGroup/{id} */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /** PATCH: api/StockGroup/{id}/toggle-active */
  toggleActive(id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/toggle-active`, {});
  }
}
