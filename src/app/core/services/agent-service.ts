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

  getAgentTableData(request: TableDataRequest, agentType: number = 1): Observable<TableResult<AgentTableResponse>> {
    const endpoint = agentType === 2 ? 'customeragent/customer-agent-table' : 'agent/agent-table';
    return this.http.post<TableResult<AgentTableResponse>>(`${this.apiUrl}${endpoint}`, request);
  }

  getAgentCode(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}agent/agent-code`);
  }

  createAgent(request:AgentRequest, agentType: number = 1):Observable<any> {
    const endpoint = agentType === 2 ? 'customeragent/create-customer-agent' : 'agent/create-agent';
    return this.http.post<any>(`${this.apiUrl}${endpoint}`, request);
  }

  getAgent(agentId: string, agentType: number = 1): Observable<Agent> {
   const endpoint = agentType === 2 ? 'customeragent/customer-agent-detail' : 'agent/agent-detail';
   return this.http.get<Agent>(`${this.apiUrl}${endpoint}/${agentId}`);
  }

  getCurrentAgent()
  {
    return this.http.get<Agent>(`${this.apiUrl}agent/current-agent`);
  }

  


  updateStatusAgent(agentId:string,actionType:number,agentType:number = 1):Observable<boolean> {
    const endpoint = agentType === 2 ? 'customeragent/update-status-customer-agent' : 'agent/update-status-agent';
    let request = {agentId:agentId,ActionType:actionType};
    return this.http.post<boolean>(`${this.apiUrl}${endpoint}`, request);
  }

}
