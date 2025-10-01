import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'cantine',
    pathMatch: 'full',
  },
  {
    path: 'cantine',
    redirectTo: 'cantine/today',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthPageModule),
  },
  {
    path: 'cantine',
    loadChildren: () =>
      import('./modules/cantine/cantine.module').then((m) => m.CantineModule),
  },
  {
    path: 'scan',
    loadChildren: () =>
      import('./modules/scan-module/scan-module.module').then((m) => m.ScanModuleModule),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes,{ onSameUrlNavigation: 'reload',preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
