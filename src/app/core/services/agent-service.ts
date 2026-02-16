import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { TableDataRequest } from '../../model/request/table-datafilter-request.model';
import { TableResult } from '../../model/table-result';
import { AgentTableResponse } from '../../model/response/agent/agent-table-response.model';
import { AgentRequest } from '../../model/request/agent/agent-request.model';
import { Agent } from '../../model/agent.model';


@Injectable({
  providedIn: 'root'
})
export class AgentService {

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private apiUrl: string   // 👈 Injecting API URL from app.config.ts
  ) {}

  /// Agent

  getAgentTableData(request: TableDataRequest): Observable<TableResult<AgentTableResponse>> {
    return this.http.post<TableResult<AgentTableResponse>>(`${this.apiUrl}agent/agent-table`, request);
  }

  getAgentCode(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}agent/agent-code`);
  }

  createAgent(request:AgentRequest):Observable<any> {
    return this.http.post<any>(`${this.apiUrl}agent/create-agent`, request);
  }

  getAgent(agentId: string): Observable<Agent> {
   return this.http.get<Agent>(`${this.apiUrl}agent/agent-detail/${agentId}`);
  }

  getCurrentAgent()
  {
    return this.http.get<Agent>(`${this.apiUrl}agent/current-agent`);
  }

  


  updateStatusAgent(agentId:string,actionType:number):Observable<boolean> {
    let request = {agentId:agentId,ActionType:actionType};
    return this.http.post<boolean>(`${this.apiUrl}agent/update-status-agent`, request);
  }

}
