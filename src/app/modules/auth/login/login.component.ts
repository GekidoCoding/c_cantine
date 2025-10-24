import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';

import { AuthenticationService } from 'src/app/modules/auth/services/authentication.service';
import { UserResponse } from '../classes/user.response';
import { User } from '../classes/user';
import { CantineService } from '../../cantine/services/cantine/cantine.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = this.fb.group({
    matricule: ['', Validators.required],
    mdp: ['', Validators.required],
  });
  mdpType: string = 'password';
  rememberMeValue: string = '';
  rememberMe: boolean = false;

  constructor(
    private fb: FormBuilder,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public toastController: ToastController, 
    private auth: AuthenticationService,
    private cantineService: CantineService,
  ) {}

  ngOnInit(): void {
    console.log(' LoginComponent initialized');
    this.loginForm.valueChanges.subscribe((res) => {
      console.log(' Form value changed:', res);
      if (res.matricule != null && res.matricule.trim() != '') {
        this.rememberMeValue = res.matricule.trim();
      } else {
        this.rememberMeValue = '';
      }
    });
    this.resetForm();
  }


  login() {
    console.log('🚀 Login attempt with values:', this.loginForm.value);
    if (this.loginForm.invalid) {
      console.warn(' Form invalid');
      this.auth.presentToast(
        "Veuillez remplir l'identifiant et le mot de passe",
        'danger'
      );
    } else {
      this.presentLoading().then(() => {
        this.auth
          .login(this.loginForm.value.matricule, this.loginForm.value.mdp)
          .subscribe(
            (res: UserResponse) => {
              sessionStorage.setItem('user', res.token);
              console.log(' Login success:', res);
              this.resetMdp();
              
              // Vérifier les privilèges pour déterminer le rôle
              this.cantineService.getPrivilegeHas41or42(res.matricule).subscribe(
                (hasPrivilege: boolean) => {
                  const role = hasPrivilege ? 'A' : 'B';
                  sessionStorage.setItem('role', role);
                  console.log('Rôle déterminé:', role);
                  
                  this.loadingController.dismiss();
                  let user:User = new User();
                  user.matricule = res.matricule;
                  console.log('Navigation après login');
                  this.auth.navigateAfterLoginCantine('generate');
                },
                (error) => {
                  console.error('Erreur lors de la vérification des privilèges:', error);
                  // En cas d'erreur, attribuer le rôle B par défaut
                  sessionStorage.setItem('role', 'B');
                  this.loadingController.dismiss();
                  let user:User = new User();
                  user.matricule = res.matricule;
                  console.log('Navigation après login');
                  // this.auth.navigateAfterLoginCantine('generate');
                }
              );
            },
            (error: HttpErrorResponse) => {
              console.error('❌ Login error:', error);
              this.resetMdp();
              this.rememberMe = false;
              this.loadingController.dismiss();
              if (error.status == 401) {
                this.presentAlertLoginFailed(
                  'Erreur',
                  'Matricule ou Mot de passe incorrect'
                );
              } else {
                this.presentAlertLoginFailed(
                  'Problème de connexion',
                  'Veuillez réessayer'
                );
              }
            }
          );
      });
    }
  }

  toggleMdpType() {
    this.mdpType = this.mdpType == 'password' ? 'text' : 'password';
    console.log(' Toggle mdpType:', this.mdpType);
  }

  resetMdp() {
    this.mdpType = 'password';
    this.mdp?.setValue('');
    console.log('MDP reset done');
  }

  resetForm() {
    this.loginForm.reset();
    console.log(' Form reset');
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'En cours de connexion...',
    });
    console.log(' Loading presented');
    await loading.present();
  }

  async presentAlertLoginFailed(header: string, message: string) {
    console.warn(' Alert:', header, '-', message);
    const alert = await this.alertController.create({
      header: header,
      subHeader: message,
      buttons: ['réessayer'],
    });
    await alert.present();
  }

  get mdp() {
    return this.loginForm.get('mdp') as FormControl;
  }

}
