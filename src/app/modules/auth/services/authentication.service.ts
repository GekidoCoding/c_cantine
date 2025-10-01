import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NavController, ToastController } from '@ionic/angular';
import { UserResponse } from '../classes/user.response';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
 
  constructor(
    private http: HttpClient,
    private nvctrl: NavController,
    private toastController: ToastController,
  ) {}

  login(matricule: string, mdp: string): Observable<UserResponse> {
    let data = {
      matricule: matricule,
      password: mdp
    };
    return this.http.post<UserResponse>(
      `${environment.PRINCIPAL}/api/auth/signin`,
      data
    );
  }
  public getMatricule(): string | null {
    const matricule = localStorage.getItem('user');
    if (matricule) {
      return matricule;
    } else {
      this.navigateAfterLoginCantine(''); 
      return null;
    }
  }
  navigateAfterLoginCantine(lieu: string) {
    let targetUrl = '/auth/login'; 
  
    if (lieu === 'scanning') {
      targetUrl = '/scan/scanning';
    } else if (lieu === 'today') {
      targetUrl = '/cantine/today';
    } else if (lieu === 'commander') {
      targetUrl = '/cantine/commander';
    } else if (lieu === 'logout') {
      targetUrl = '/auth/login';
    }else if(lieu=='generate'){
        targetUrl='/scan/generate';
    }
  
    this.nvctrl.navigateRoot(targetUrl).then(() => {
      window.location.reload();
    });
  }
  
  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      duration: 2000,
    });
    toast.present();
  }
}
