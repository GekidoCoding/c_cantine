import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Constant } from '../general/classes/constant';
import { MenuItem } from '../general/classes/menu-item';
import { AccountService } from '../auth/services/account/account.service';
import { User } from '../auth/classes/user';
import { AuthenticationService } from '../auth/services/authentication.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan-module.component.html',
  styleUrls: ['./scan-module.component.scss'],
})
export class ScanModuleComponent implements OnInit, OnDestroy {
  public matricule:string | null=null;
  public agent:User = new User();
  public nom:any;
  version: string = '';
  public activeTab: string = 'generate';
  menu: MenuItem[] = [];
  role: string = sessionStorage.getItem('role') ?? 'B';
  public displayName: string = '';

  constructor(
      private alertController: AlertController , 
      private loadingController: LoadingController,
      private accountService:AccountService,
      private router: Router,
      private authService:AuthenticationService
  ) {}
  ngOnInit(): void {
    this.loadAgent();
    if(this.role === 'A'){
      this.menu = Constant.menuPrincipalA;
    }else{
      this.menu = Constant.menuPrincipalB;
    }
    this.menu = Constant.menuPrincipalA;
    this.matricule=this.accountService.getMatricule();
    this.setActiveTabFromRoute();
  }
  loadAgent(){
    let userInput: User = {
      matricule: this.accountService.getMatricule(),
    };
    this.accountService.getAgentActif(userInput).subscribe((res: User[]) => {
        this.agent=res[0];
        this.displayName = this.truncateName(this.agent.nom + ' (' + this.agent.fonction + ')');
    });
  }

  truncateName(name: string, maxLength: number = 25): string {
    if (name && name.length > maxLength) {
      return name.substring(0, maxLength) + '...';
    }
    return name || '';
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
          handler: () => {
            this.accountService.logout();
          }
        }
      ]
    });

    await alert.present();
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: '...',
    });
    await loading.present();
  }
}
