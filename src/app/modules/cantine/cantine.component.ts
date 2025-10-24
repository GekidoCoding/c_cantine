import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { MenuItem } from '../general/classes/menu-item';
import { AccountService } from '../auth/services/account/account.service';
import { User } from '../auth/classes/user';
import { Constant } from '../general/classes/constant';
import { BackButtonService } from '../general/services/back-button.service';

@Component({
  selector: 'app-cantine',
  templateUrl: './cantine.component.html',
  styleUrls: ['./cantine.component.scss'],
})
export class CantineComponent implements OnInit, OnDestroy {
  public matricule:string | null=null;
  public agent:User = new User();
  public nom:any;
  version: string = '';
  public activeTab: string = 'today';
  menu: MenuItem[] = [];

  constructor(
      private alertController: AlertController , 
      private loadingController: LoadingController,
      private accountService:AccountService,
      private backButtonService: BackButtonService
  ) {}
  ngOnInit(): void {
    this.loadAgent();
    this.matricule=this.accountService.getMatricule();
    this.loadMenuBasedOnRole();
    
    // Démarrer l'écoute du bouton retour
    this.backButtonService.startBackButtonListener();
  }

  ngOnDestroy(): void {
    // Arrêter l'écoute du bouton retour
    this.backButtonService.stopBackButtonListener();
  }
  loadAgent(){
    let userInput: User = {
      matricule: this.accountService.getMatricule(),
    };
    this.accountService.getAgentActif(userInput).subscribe((res: User[]) => {
        this.agent=res[0];
    });
  }

  loadMenuBasedOnRole() {
    const role = sessionStorage.getItem('role');
    console.log('Rôle actuel:', role);
    
    if (role === 'A') {
      // Rôle A : accès complet (Check Repas + QR Repas)
      this.menu = Constant.menuPrincipalA;
    } else {
      // Rôle B : accès limité (seulement Check Repas)
      this.menu = Constant.menuPrincipalB;
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
