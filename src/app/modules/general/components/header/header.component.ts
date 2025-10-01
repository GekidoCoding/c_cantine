import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular'; 
import { User } from 'src/app/modules/auth/classes/user';
import { AccountService } from 'src/app/modules/auth/services/account/account.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public matricule: string | null = null;
  public agent: User = new User();

  constructor(
    private accountService: AccountService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  ngOnInit(): void {
    this.loadAgent();
  }

  loadAgent() {
    let userInput: User = {
      matricule: this.accountService.getMatricule(),
    };
    this.accountService.getAgentActif(userInput).subscribe((res: User[]) => {
      this.agent = res[0];
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