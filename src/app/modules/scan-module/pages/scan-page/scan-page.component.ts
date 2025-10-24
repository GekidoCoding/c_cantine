import { Component, OnDestroy, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Platform, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/modules/auth/services/authentication.service';
import { CantAgent } from 'src/app/modules/cantine/models/cant-agent';
import { CantRefMenuWithLib } from 'src/app/modules/cantine/models/cant-ref-menu-with-lib';
import { CantineService } from 'src/app/modules/cantine/services/cantine/cantine.service';

@Component({
  selector: 'app-scan-page',
  templateUrl: './scan-page.component.html',
  styleUrls: ['./scan-page.component.scss']
})
export class ScanPageComponent implements OnInit, OnDestroy {
  scanning = false;
  repas: CantRefMenuWithLib = new CantRefMenuWithLib();

  constructor(
    private platform: Platform,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private authService: AuthenticationService,
    private cantineService: CantineService
  ) { }

  ngOnInit(): void {
    this.getRepasAgentMatricule();
  }

  ngOnDestroy(): void {
    this.stopScan();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Scanning en cours...',
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

  async startScan() {
    if (!this.platform.is('android')) {
      await this.presentErrorToast('Fonction réservée à Android.');
      return;
    }

    try {
      const loading = await this.presentLoading();
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (!status.granted) {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Permission caméra requise',
          message: 'Veuillez autoriser la caméra pour scanner le QR code.',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }

      await BarcodeScanner.prepare();
      await BarcodeScanner.hideBackground();
      document.querySelector('body')?.classList.add('scanner-active');
      this.scanning = true;

      const result = await BarcodeScanner.startScan();

      if (result.hasContent && result.content) {
        const json = JSON.parse(result.content);
        const cantAgent: CantAgent = Object.assign(new CantAgent(), json);
        console.log("cant agent scanning: " + JSON.stringify(cantAgent));
        if (cantAgent.agent_matricule) {
          this.cantineService.getCantineNow(cantAgent.agent_matricule).subscribe({
            next: async (data) => {
              const repas: CantRefMenuWithLib = data.listCantRefMenuWithLib[0];
              console.log("Son repas est: " + JSON.stringify(repas));
              this.repas = repas;
              this.cantineService.setFlagRecuCantAgent(cantAgent).subscribe({
                next: async () => {
                  repas.cantAgentWithLib.flag_recu="O";
                  localStorage.setItem("repasAgent", JSON.stringify(repas));
                  await this.presentSuccessToast('Scan effectué avec succès !');
                  console.log("Scan successfully");
                },
                error: async (err) => {
                  await this.presentErrorToast('Erreur lors de la mise à jour du statut.');
                  console.error('Erreur lors de la mise à jour:', err);
                }
              });
            },
            error: async (err) => {
              await this.presentErrorToast('Erreur lors de la récupération du repas.');
              console.error('Erreur lors de la récupération:', err);
            }
          });
        } else {
          await this.presentErrorToast('QR code invalide.');
        }
      } else {
        await this.presentErrorToast('Aucun contenu scanné.');
      }
    } catch (err) {
      await this.presentErrorToast('Erreur lors du scan.');
      console.error('Erreur lors du scan:', err);
    } finally {
      await this.stopScan();
    }
  }

  getRepasAgentMatricule() {
    const repasJson = localStorage.getItem("repasAgent");
    if (repasJson) {
      const obj = JSON.parse(repasJson);
      this.repas = Object.assign(new CantRefMenuWithLib(), obj);
    }
  }

  async stopScan() {
    this.scanning = false;
    await BarcodeScanner.showBackground();
    await BarcodeScanner.stopScan();
    document.querySelector('body')?.classList.remove('scanner-active');
    await this.loadingController.dismiss();
    this.authService.navigateAfterLoginCantine('scanning');
  }
}