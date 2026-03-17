import { Routes } from '@angular/router';

export const STOCK_INCHARGE_ROUTES: Routes = [
  {
    path: 'parcel-scanners/:status',
    loadComponent: () =>
      import('./pages/parcel-scanners/parcel-scanners')
        .then(c => c.ParcelScanners)
  },
  
    // =========================
    // Visitors
    // =========================
    {
      path: 'visitors',
      loadComponent: () =>
        import('./pages/visitors/visitor-list/visitor-list')
          .then(c => c.VisitorList)
    },
    {
      path: 'visitor/add',
      loadComponent: () =>
        import('./pages/visitors/add-visitor/add-visitor')
          .then(c => c.AddVisitor)
    },
    {
      path: 'visitor/edit/:id',
      loadComponent: () =>
        import('./pages/visitors/add-visitor/add-visitor')
          .then(c => c.AddVisitor)
    },
    {
      path: 'visitor/print/:id',
      loadComponent: () =>
        import('../../components/print/visitor-print/visitor-print')
          .then(c => c.VisitorPrint)
    },
  { path: '', redirectTo: 'parcel-scanners', pathMatch: 'full' }
];
