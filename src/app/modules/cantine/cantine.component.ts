import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { MenuItem } from '../general/classes/menu-item';
import { AccountService } from '../auth/services/account/account.service';
import { User } from '../auth/classes/user';
import { Constant } from '../general/classes/constant';

@Component({
  selector: 'app-cantine',
  templateUrl: './cantine.component.html',
  styleUrls: ['./cantine.component.scss'],
})
export class CantineComponent implements OnInit {
  public matricule:string | null=null;
  public agent:User = new User();
  public nom:any;
  version: string = '';
  public activeTab: string = 'today';
  menu: MenuItem[] = [];
  public displayName: string = '';

  constructor(
      private alertController: AlertController , 
      private loadingController: LoadingController,
      private accountService:AccountService
  ) {}
  ngOnInit(): void {
    this.loadAgent();
    this.matricule=this.accountService.getMatricule();
    this.loadMenuBasedOnRole();

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
