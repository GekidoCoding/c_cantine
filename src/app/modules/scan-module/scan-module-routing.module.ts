import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScanModuleComponent } from './scan-module.component';
import { AppGuard } from 'src/app/guard/app.guard';
import { GenerateScanComponent } from './pages/generate-scan/generate-scan.component';
import { ScanPageComponent } from './pages/scan-page/scan-page.component';
const routes: Routes = [
  {
    path: '',
    component: ScanModuleComponent, 
    canActivate:[AppGuard],
    children: [
      { path: '', redirectTo: 'generate', pathMatch: 'full' },
      { path: 'generate', component: GenerateScanComponent },
      { path: 'scanning', component: ScanPageComponent },
      { path: '**', redirectTo: 'generate', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScanModuleRoutingModule { }
