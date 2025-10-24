import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScanModuleRoutingModule } from './scan-module-routing.module';
import { ScanModuleComponent } from './scan-module.component';
import { GenerateScanComponent } from './pages/generate-scan/generate-scan.component';
import { ScanPageComponent } from './pages/scan-page/scan-page.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    ScanModuleComponent,
    GenerateScanComponent,
    ScanPageComponent
  ],
  imports: [
    CommonModule,
    ScanModuleRoutingModule,
    IonicModule.forRoot(),
    
  ]
})
export class ScanModuleModule { }
