// cantine.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CantineRoutingModule } from './cantine-routing-module';
import { CantineComponent } from './cantine.component';
import { TodayPageComponent } from './pages/today-page/today-page.component';

@NgModule({
  declarations: [
    CantineComponent,
    TodayPageComponent,
  ],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    CantineRoutingModule,
  ]
})
export class CantineModule {}
