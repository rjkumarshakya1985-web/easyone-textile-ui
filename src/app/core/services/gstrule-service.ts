import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../../config/api.config';
import { Observable } from 'rxjs';
import { GstRuleDto } from '../../model/response/gstrule/gstrule-response.model';
import { GstRuleRequest } from '../../model/request/gst-rule-request.model';


@Injectable({
  providedIn: 'root'
})
export class GstRuleService {

   private baseUrl: string;

   constructor(private http: HttpClient,
    @Inject(API_CONFIG) private apiUrl: string
   ) 
   {
    this.baseUrl = `${this.apiUrl}gstrule`;
    }

   
   getAll(): Observable<GstRuleDto[]> {
        return this.http.get<GstRuleDto[]>(`${this.baseUrl}`);
   }

   /** POST: api/StockGroup */
   create(request: GstRuleRequest): Observable<void> {
       return this.http.post<void>(this.baseUrl, request);
     }
   
   edit(request:GstRuleRequest):Observable<void>{
    return this.http.put<void>(this.baseUrl,request);
   }
}
