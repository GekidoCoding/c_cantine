import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseCant } from '../../models/response-cant';
import { CantAgent } from '../../models/cant-agent';

@Injectable({
  providedIn: 'root'
})
export class CantineService {
  private apiUrl=environment.BASE_URL_CANTINE;
  constructor(
    private http:HttpClient
  ) { }

  getCantineNow(matricule:string|null): Observable<ResponseCant> {
    return this.http.get<ResponseCant>(`${this.apiUrl}/getRepasAgentToday?agent_matricule=${matricule}`);
   
  }
  
  setFlagRecuCantAgent(cantAgent:CantAgent):Observable<CantAgent>{
    return this.http.post<CantAgent>(`${this.apiUrl}/setFlagRecuCantAgent`, cantAgent);
  } 
  
}
