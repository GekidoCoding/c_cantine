import { MenuItem } from './menu-item';

export class Constant {
  static appVersion = '1.0.0';
  static title = new Map([
    ['/travailleur/cit', 'CIT']
  ]);
  static menuPrincipalA: MenuItem[] = [
    {
      title: 'Check Repas ',
      url: '/cantine/today',
      icon: 'checkmark-circle',
    },
    {
      title: 'Scanner Repas',
      url: '/scan/generate',
      icon: 'qr-code-outline',
    },
  ];
  static menuPrincipalB: MenuItem[] = [
    {
      title: 'Scanner Repas',
      url: '/scan/generate',
      icon: 'qr-code-outline',
    },
  ];
}
