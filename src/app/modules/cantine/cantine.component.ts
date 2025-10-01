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

  constructor(
      private alertController: AlertController , 
      private loadingController: LoadingController,
      private accountService:AccountService
  ) {}
  ngOnInit(): void {
    this.loadAgent();
    this.matricule=this.accountService.getMatricule();
    this.menu=Constant.menuPrincipal;

  }
  loadAgent(){
    let userInput: User = {
      matricule: this.accountService.getMatricule(),
    };
    this.accountService.getAgentActif(userInput).subscribe((res: User[]) => {
        this.agent=res[0];
    });
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
