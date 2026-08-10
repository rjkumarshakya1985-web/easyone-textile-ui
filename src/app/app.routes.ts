import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { NotFoundRecord } from './components/not-found-record/not-found-record';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then(m => m.Login)
  },

  {
    path: 'supplier',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    loadComponent: () =>
      import('./layouts/supplier-layout/supplier-layout').then(m => m.SupplierLayout),
    loadChildren: () =>
      import('./layouts/supplier-layout/supplier.routes').then(m => m.SUPPLIER_ROUTES)
  },

  {
    path: 'admin',
    canActivate: [roleGuard('SuperAdmin')],
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout').then(m => m.AdminLayout),
    loadChildren: () =>
      import('./layouts/admin-layout/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  
  {
    path: 'stock-incharge',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/store-operator-layout/store-operator-layout')
        .then(m => m.StoreOperatorLayout),
    loadChildren: () =>
      import('./layouts/store-operator-layout/store-operator.routes')
        .then(m => m.STOCK_INCHARGE_ROUTES)
  },

  { path: 'not-found', component: NotFoundRecord },
  { path: '**', redirectTo: 'login' }
];
