import { Component, OnDestroy, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Platform, AlertController, LoadingController, ToastController } from '@ionic/angular';
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
      await loading.dismiss();

      const result = await BarcodeScanner.startScan();

      if (result.hasContent && result.content) {
        await this.processScanResult(result.content);
      } else {
        await this.presentErrorToast('Aucun contenu scanné.');
      }
    } catch (err) {
      console.error('Erreur lors du scan:', err);
      await this.presentErrorToast('Erreur lors du scan.');
    } finally {
      await this.stopScan();
    }
  }

  private async processScanResult(content: string) {
    try {
      const json = JSON.parse(content);
      const cantAgent: CantAgent = Object.assign(new CantAgent(), json);
      
      if (cantAgent.agent_matricule) {
        const loading = await this.presentLoading();
        
        this.cantineService.getCantineNow(cantAgent.agent_matricule).subscribe({
          next: async (data) => {
            await loading.dismiss();
            const repas: CantRefMenuWithLib = data.listCantRefMenuWithLib[0];
            this.repas = repas;
            
            this.cantineService.setFlagRecuCantAgent(cantAgent).subscribe({
              next: async () => {
                repas.cantAgentWithLib.flag_recu = "O";
                sessionStorage.setItem("repasAgent", JSON.stringify(repas));
                await this.presentSuccessToast('Scan effectué avec succès !');
              },
              error: async () => {
                await this.presentErrorToast('Erreur lors de la mise à jour du statut.');
              }
            });
          },
          error: async () => {
            await loading.dismiss();
            await this.presentErrorToast('Erreur lors de la récupération du repas.');
          }
        });
      } else {
        await this.presentErrorToast('QR code invalide.');
      }
    } catch (parseError) {
      await this.presentErrorToast('Format de QR code invalide.');
    }
  }

  getRepasAgentMatricule() {
    const repasJson = sessionStorage.getItem("repasAgent");
    if (repasJson) {
      const obj = JSON.parse(repasJson);
      this.repas = Object.assign(new CantRefMenuWithLib(), obj);
    }
  }

  async stopScan() {
    try {
      this.scanning = false;
      await BarcodeScanner.showBackground();
      await BarcodeScanner.stopScan();
      document.querySelector('body')?.classList.remove('scanner-active');
      
      const loading = await this.loadingController.getTop();
      if (loading) {
        await loading.dismiss();
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'arrêt du scan:', error);
      // Forcer le nettoyage même en cas d'erreur
      this.scanning = false;
      document.querySelector('body')?.classList.remove('scanner-active');
    }
  }
}