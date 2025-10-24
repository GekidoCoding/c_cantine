import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { AccountService } from 'src/app/modules/auth/services/account/account.service';
import * as QRCode from 'qrcode';
import { CantRefMenuWithLib } from 'src/app/modules/cantine/models/cant-ref-menu-with-lib';
import { CantAgent } from 'src/app/modules/cantine/models/cant-agent';
import { CantineService } from 'src/app/modules/cantine/services/cantine/cantine.service';

@Component({
  selector: 'app-generate-scan',
  templateUrl: './generate-scan.component.html',
  styleUrls: ['./generate-scan.component.scss']
})
export class GenerateScanComponent implements OnInit {
  repas: CantRefMenuWithLib = new CantRefMenuWithLib();
  cantAgent: CantAgent = new CantAgent();
  qrData: string | null = null;
  constructor(
    private cantineService: CantineService,
    private accounService: AccountService,
    private loadingController: LoadingController,
    private toastController: ToastController
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
          await this.showQRrepas();
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

  async showQRrepas() {
    if (this.cantAgent.id_cant_agent) {
      const loading = await this.presentLoading('Génération du QR code...');
      try {
        const payload = JSON.stringify(this.cantAgent);
        this.qrData = await QRCode.toDataURL(payload, { width: 300 });
      } catch (err) {
        console.error('showQRrepas: QR generation failed', err);
        this.qrData = null;
        await this.presentErrorToast('Erreur lors de la génération du QR code.');
      } finally {
        await loading.dismiss();
      }
    } 
    // else {
    //   await this.presentErrorToast('Aucun repas valide pour générer un QR code.');
    // }
  }
}