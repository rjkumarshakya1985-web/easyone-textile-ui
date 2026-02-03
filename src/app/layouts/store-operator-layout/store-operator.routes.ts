import { Routes } from '@angular/router';

export const STOCK_INCHARGE_ROUTES: Routes = [
  {
    path: 'parcel-scanners',
    loadComponent: () =>
      import('./pages/parcel-scanners/parcel-scanners')
        .then(c => c.ParcelScanners)
  },
  {
    path: 'visitors',
    loadComponent: () =>
      import('./pages/visitors/visitors')
        .then(c => c.Visitors)
  },
  { path: '', redirectTo: 'parcel-scanners', pathMatch: 'full' }
];
