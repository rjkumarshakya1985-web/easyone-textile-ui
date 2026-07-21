import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { State } from '../../model/state.model';
import { City } from '../../model/city.model';
import { DepartmentRequest } from '../../model/request/department/department-request.model';
import { DepartmentResponse } from '../../model/response/department/department.model';
import { SubDepartmentResponse } from '../../model/response/sub-department/sub-department.model';
import { TableDataRequest } from '../../model/request/table-datafilter-request.model';
import { TableResult } from '../../model/table-result';
import { ProductHsnCode } from '../../model/response/hsn-code.model';
import { ProductHsnCodeRequest } from '../../model/request/hsn-code-request.model';
import { Gsts } from '../../model/views/gsts-view.model';
import { LookupDto } from '../../model/views/lookup.model';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private apiUrl: string
  ) {}

  // ✔ Get all States
  getStates(): Observable<State[]> {
    return this.http.get<State[]>(`${this.apiUrl}master/states`);
  }

  // ✔ Get all Cities
  getCities(): Observable<City[]> {
    return this.http.get<City[]>(`${this.apiUrl}master/cities`);
  }

  // ✔ Get Cities By State ID (MOST IMPORTANT)
  getCitiesByStateId(stateId: number): Observable<City[]> {
    return this.http.get<City[]>(`${this.apiUrl}master/cities/${stateId}`);
  }

  getDepartments(): Observable<DepartmentResponse[]> {
      return this.http.get<DepartmentResponse[]>(`${this.apiUrl}master/departments`);
  }

  saveDepartment(request: DepartmentRequest): Observable<boolean> {
      return this.http.post<boolean>(`${this.apiUrl}master/savedepartment`, request);
  }

  getSubDepartments(departmentId:number): Observable<SubDepartmentResponse[]> {
      return this.http.get<SubDepartmentResponse[]>(`${this.apiUrl}master/sub-departments/${departmentId}`);
  }

  saveSubDepartment(request: DepartmentRequest): Observable<boolean> {
      return this.http.post<boolean>(`${this.apiUrl}master/savesubdepartment`, request);
  }

  /// Hsn code
  getHsnCodeLookup(): Observable<LookupDto<string>[]> {
  return this.http.get<LookupDto<string>[]>(`${this.apiUrl}master/hsncode-lookup`);
  }

  getHsnCodeTableData(request: TableDataRequest): Observable<TableResult<ProductHsnCode>> {
      return this.http.post<TableResult<ProductHsnCode>>(`${this.apiUrl}master/hsncode-table`, request);
  }

  createHsnCode(request: ProductHsnCodeRequest): Observable<boolean> {
      return this.http.post<boolean>(`${this.apiUrl}master/create-hsncode`, request);
  }

  deleteHsnCode(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}master/delete-hsncode/${id}`);
  }
  
  getGsts(): Observable<Gsts[]> {
      return this.http.get<Gsts[]>(`${this.apiUrl}master/gsts`);
  }

  getTransportLookup(transportType?: number): Observable<LookupDto<number>[]> {
    const url = transportType
      ? `${this.apiUrl}master/transport-lookup?transportType=${transportType}`
      : `${this.apiUrl}master/transport-lookup`;

    return this.http.get<LookupDto<number>[]>(url);
  }
}
