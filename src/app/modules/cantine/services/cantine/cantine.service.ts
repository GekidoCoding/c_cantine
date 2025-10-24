import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ResponseCant } from '../../models/response-cant';
import { CantAgent } from '../../models/cant-agent';
import { PrivilegeCantine } from '../../models/privilege-cantine';

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
  
  getPrivilege(matricule: string): Observable<PrivilegeCantine[]> {
    console.log('getPrivilege matricule:', matricule);

    return this.http.get<PrivilegeCantine[]>(`${environment.PRINCIPAL}/cant/api/privileges/user/${matricule}`);
  } 
  
  getPrivilegeHas41or42(matricule: string): Observable<boolean> {
    console.log('getPrivilegeHas41or42 matricule:', matricule);
    return this.getPrivilege(matricule).pipe(
      map((privileges: PrivilegeCantine[]) => 
        privileges.some(p => p.priv === 41 || p.priv === 42)
      )
    );
  }
  
}
