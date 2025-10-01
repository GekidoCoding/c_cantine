import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import jwt_decode from 'jwt-decode';
import { User } from '../../classes/user';
import { AuthenticationService } from '../authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private userSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  private fromPrincipal: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor( private http: HttpClient , 
    private authenticationService:AuthenticationService
  ) {}

  public get user(): BehaviorSubject<User | null> {
    return this.userSubject;
  }
  public get firstLogin(): BehaviorSubject<boolean> {
    return this.fromPrincipal;
  }
  setFirstLogin(isFirstLogin: boolean) {
    this.fromPrincipal.next(isFirstLogin);
  }
  setUser(user: User) {
    this.userSubject.next(user);
  }
  getNewAccessToken(oldToken: string) {
    let httpHeader = new HttpHeaders();
    httpHeader = httpHeader
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${oldToken}`);

    return this.http.get(`${environment.PRINCIPAL}/api/auth/access-token`, {
      headers: httpHeader,
    });
  }
  getToken(): string | null {
    let session = sessionStorage.getItem('user');
    if (session != null) {
      return session;
    }
    return null;
  }
  getMatricule() {
    let session = sessionStorage.getItem('user');
    if (session != null) {
      return this.decodeUserInfo(session).matricule;
    }
    return null;
  }
  getUserInfoInToken() {
    let session = sessionStorage.getItem('user');
    if (session != null) {
      return this.decodeUserInfo(session);
    }
    return null;
  }
  getUserOracle() {
    let session = sessionStorage.getItem('user');
    if (session != null) {
      return this.decodeUserInfo(session).userOracle;
    }
    return null;
  }
  decodeUserInfo(token: string): any {
    if (token) return jwt_decode(token);

    return null;
  }

  getAgentActif(input: User): Observable<User[]> {
    return this.http.get<User[]>(`${environment.PRINCIPAL}/api/getagentActifs`, {
      params: { agentMatricule: input.matricule },
    });
  }

  logout(onSuccess?: () => void, onError?: () => void) {
    const data = {
      matricule: this.getMatricule(),
    };
    sessionStorage.clear();
    this.http.post(`${environment.PRINCIPAL}/api/auth/logout`, data).subscribe({
      next: () => {
        this.authenticationService.navigateAfterLoginCantine('logout');
        if (onSuccess) onSuccess(); // Appeler le callback de succès
      },
      error: () => {
        this.authenticationService.navigateAfterLoginCantine('logout');
        if (onError) onError(); // Appeler le callback d'erreur
      }
    });
  }
}
