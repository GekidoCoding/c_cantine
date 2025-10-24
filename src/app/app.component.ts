import { Component, OnInit } from '@angular/core';
import { Constant } from './modules/general/classes/constant';
import { MenuItem } from './modules/general/classes/menu-item';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  menu: MenuItem[] = [];
  version: string = '';
  role: string = sessionStorage.getItem('role') ?? 'B';
  constructor(
    private loadingController: LoadingController,
  ) {
  }
  ngOnInit(): void {
    if(this.role === 'A'){
      this.menu = Constant.menuPrincipalA;
    }else{
      this.menu = Constant.menuPrincipalB;
    }
    
  }
  

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: '...',
    });
    await loading.present();
  }
}
