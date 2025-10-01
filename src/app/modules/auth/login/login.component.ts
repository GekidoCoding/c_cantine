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
  ) {}

  ngOnInit(): void {
    this.loginForm.valueChanges.subscribe((res) => {
      if (res.matricule != null && res.matricule.trim() != '') {
        this.rememberMeValue = res.matricule.trim();
      } else {
        this.rememberMeValue = '';
      }
    });
    this.resetForm();
  }


  login() {
    if (this.loginForm.invalid) {
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
              this.resetMdp();
              this.loadingController.dismiss();
              let user:User = new User();
              user.matricule = res.matricule;
              this.auth.navigateAfterLoginCantine('today');
            },
            (error: HttpErrorResponse) => {
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
  }

  resetMdp() {
    this.mdpType = 'password';
    this.mdp?.setValue('');
  }

  resetForm() {
    this.loginForm.reset();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
    });
    await loading.present();
  }

  async presentAlertLoginFailed(header: string, message: string) {
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
