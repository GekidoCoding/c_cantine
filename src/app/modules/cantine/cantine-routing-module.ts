import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CantineComponent } from './cantine.component';
import { TodayPageComponent } from './pages/today-page/today-page.component';
import { AppGuard } from 'src/app/guard/app.guard';
const routes: Routes = [
  {
    path: '',
    component: CantineComponent, 
    canActivate:[AppGuard],
    children: [
      { path: '', redirectTo: 'today', pathMatch: 'full' },
      { path: 'today', component: TodayPageComponent },
      { path: '**', redirectTo: 'today', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CantineRoutingModule {}
