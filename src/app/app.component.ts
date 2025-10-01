import { Component, OnInit } from '@angular/core';
import { Constant } from './modules/general/classes/constant';
import { MenuItem } from './modules/general/classes/menu-item';
import { AlertController, LoadingController } from '@ionic/angular';
import { AccountService } from './modules/auth/services/account/account.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  menu: MenuItem[] = [];
  version: string = '';
  constructor(
    private loadingController: LoadingController,
    private alertController:AlertController,
    private accountService:AccountService
  ) {
  }
  ngOnInit(): void {
    this.menu = Constant.menuPrincipal;
  }
  

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: '...',
    });
    await loading.present();
  }
  async presentLogoutAlert() {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'Voulez-vous vraiment vous déconnecter ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Se déconnecter',
          role: 'confirm',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Déconnexion en cours...',
              spinner: 'crescent' 
            });
            await loading.present();

            this.accountService.logout(() => {
              loading.dismiss();
            }, () => {
              loading.dismiss(); 
            });
          }
        }
      ]
    });

    await alert.present();
  }
}
