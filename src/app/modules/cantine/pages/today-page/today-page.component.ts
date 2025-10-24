import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { CantineService } from '../../services/cantine/cantine.service';
import { CantAgent } from '../../models/cant-agent';
import { CantRefMenuWithLib } from '../../models/cant-ref-menu-with-lib';
import { AccountService } from 'src/app/modules/auth/services/account/account.service';

@Component({
  selector: 'app-today-page',
  templateUrl: './today-page.component.html',
  styleUrls: ['./today-page.component.scss']
})
export class TodayPageComponent implements OnInit {
  repas: CantRefMenuWithLib = new CantRefMenuWithLib();
  cantAgent: CantAgent = new CantAgent();
  qrData: string | null = null;

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private cantineService: CantineService,
    private accounService: AccountService
  ) { }

  ngOnInit(): void {
    this.initRepas();
  }

  async presentLoading(message: string) {
    const loading = await this.loadingController.create({
      message,
      spinner: 'crescent'
    });
    await loading.present();
    return loading;
  }

  async presentSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'success',
      position: 'bottom',
      cssClass: 'custom-toast'
    });
    await toast.present();
  }

  async presentErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'danger',
      position: 'bottom',
      cssClass: 'custom-toast'
    });
    await toast.present();
  }

  async initRepas() {
    const loading = await this.presentLoading('Chargement du repas...');
    try {
      const matricule = this.accounService.getMatricule();
      this.cantineService.getCantineNow(matricule).subscribe({
        next: async (data) => {
          console.log("repas now: " + JSON.stringify(data));
          this.repas = data.listCantRefMenuWithLib[0];
          this.cantAgent.id_cant_agent = data.listCantRefMenuWithLib[0]?.cantAgentWithLib?.id_cant_agent;
          this.cantAgent.agent_matricule = this.accounService.getMatricule();
        },
        error: async (err) => {
          console.error('initRepas: Erreur lors de la requête: ', err);
          await this.presentErrorToast('Erreur lors du chargement du repas.');
        },
        complete: async () => {
          await loading.dismiss();
        }
      });
    } catch (err) {
      await loading.dismiss();
      await this.presentErrorToast('Erreur inattendue lors du chargement.');
      console.error('initRepas: Erreur: ', err);
    }
  }

  async recevoirRepas() {
    if (this.cantAgent.id_cant_agent) {
      const loading = await this.presentLoading('Mise à jour du repas...');
      try {
        console.log("recevoirRepas: this.cantAgent.id_cant_agent: " + JSON.stringify(this.cantAgent));
        this.cantineService.setFlagRecuCantAgent(this.cantAgent).subscribe({
          next: async (data) => {
            console.log('recevoirRepas: Réponse reçue: ' + JSON.stringify(data));
            await this.initRepas();
            console.log("nouveau repas: " + JSON.stringify(this.repas));
            await this.presentSuccessToast('Repas marqué comme reçu !');
          },
          error: async (err) => {
            console.error('recevoirRepas: Erreur lors de la requête: ', err);
            await this.presentErrorToast('Erreur lors de la mise à jour du repas.');
          },
          complete: async () => {
            await loading.dismiss();
          }
        });
      } catch (err) {
        await loading.dismiss();
        await this.presentErrorToast('Erreur inattendue lors de la mise à jour.');
        console.error('recevoirRepas: Erreur: ', err);
      }
    } else {
      await this.presentErrorToast('Aucun repas valide à marquer comme reçu.');
      console.log("oooh no! this.cantAgent.id_cant_agent is none in cantAgent to RequestBody");
    }
  }

  async takeMeal() {
    const alert = await this.alertController.create({
      header: 'Confirmer votre choix',
      message: 'Voulez-vous vraiment prendre ce repas du ' + this.repas.date_ref_menuFormated,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Confirmer',
          handler: () => {
            this.recevoirRepas();
          }
        }
      ]
    });

    await alert.present();
  }
}