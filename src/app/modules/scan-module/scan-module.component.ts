import { Component, OnDestroy, OnInit } from '@angular/core';
import {  AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

import { AuthenticationService } from '../auth/services/authentication.service';
import { User } from '../auth/classes/user';
import { AccountService } from '../auth/services/account/account.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan-module.component.html',
  styleUrls: ['./scan-module.component.scss'],
})
export class ScanModuleComponent implements OnInit, OnDestroy {
  public role:string|null ='';
  public nom:any; 
  version: string = '';
  public activeTab: string = 'generate';
  agent:User = new User();
  constructor(
       
      private loadingController: LoadingController,
      private router: Router,
      private authService:AuthenticationService,
      private accountService:AccountService,
      private alertController:AlertController,
  ) {}
  ngOnInit(): void {
    this.loadAgent();
    this.setActiveTabFromRoute();
    this.role= sessionStorage.getItem('role')??'B';
  }
  loadAgent() {
    let userInput: User = {
      matricule: this.accountService.getMatricule(),
    };
    this.accountService.getAgentActif(userInput).subscribe((res: User[]) => {
      this.agent = res[0];
    });
  }
  ngOnDestroy(): void {
    
  }

  navigateToLeft() {
    this.activeTab = 'generate';
    this.authService.navigateAfterLoginCantine('generate');
  }

  navigateToRight() {
    this.activeTab = 'scanning';
    this.authService.navigateAfterLoginCantine('scanning');
  }

  private setActiveTabFromRoute() {
    const currentUrl = this.router.url;
    if (currentUrl.includes('/scanning')) {
      this.activeTab = 'scanning';
    } else {
      this.activeTab = 'generate';
    }
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

            this.accountService.logout();
            loading.dismiss();
          }
        }
      ]
    });

    await alert.present();
  }
}
