import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BackButtonService {
  private backButtonSubscription: any;

  constructor(
    private platform: Platform,
    private router: Router
  ) {}

  startBackButtonListener() {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(101, () => {
      const currentUrl = this.router.url;
      
      // Gestion spécifique selon la route actuelle
      if (currentUrl.includes('/scan/camera')) {
        // Retour au composant scan normal
        this.router.navigate(['/scan/generate']);
      } else if (currentUrl.includes('/scan/generate')) {
        // Retour au menu principal
        this.router.navigate(['/cantine/today']);
      } else if (currentUrl.includes('/cantine/today')) {
        // Fermer l'application
        if ((navigator as any).app && (navigator as any).app.exitApp) {
          (navigator as any).app.exitApp();
        } 
      } else {
        // Navigation par défaut
        this.router.navigate(['/scan/generate']);
      }
    });
  }

  stopBackButtonListener() {
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }
}
