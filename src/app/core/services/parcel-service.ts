import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { ParcelResponse } from '../../model/response/parcel/parcel-response.model';
import { ParcelScanRequest } from '../../model/request/parcel/parcel-scan-response.model';

@Injectable({
  providedIn: 'root'
})
export class ParcelService {

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private apiUrl: string
  ) {}

  getParcelScanInfo(parcelId: number,status:number): Observable<ParcelResponse> {
    return this.http.get<ParcelResponse>(
      `${this.apiUrl}parcel/scan-info/${parcelId}/status/${status}`
    );
  }

  

  changeParcelStatus(request: ParcelScanRequest): Observable<boolean> {
      return this.http.put<boolean>(`${this.apiUrl}parcel/change`, request);
    }
}

