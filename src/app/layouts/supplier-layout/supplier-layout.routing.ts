import { Routes } from '@angular/router';

export const SupplierLayoutRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then(m => m.Dashboard)
  },
//   {
//     path: 'users',
//     loadComponent: () =>
//       import('../../super/users/users.component').then(m => m.UsersComponent)
//   },
//   {
//     path: 'user/:id',
//     loadComponent: () =>
//       import('../../super/user/user.component').then(m => m.UserComponent)
//   },
//   {
//     path: 'supplier-export',
//     loadComponent: () =>
//       import('../../super/supplier-export/supplier-export.component').then(m => m.SupplierExportComponent)
//   },
//   {
//     path: 'supplier-products',
//     loadComponent: () =>
//       import('../../super/products/products.component').then(m => m.ProductsComponent)
//   },
//   {
//     path: 'supplier-product/:id',
//     loadComponent: () =>
//       import('../../super/product/product.component').then(m => m.ProductComponent)
//   },
//   {
//     path: 'parcel-scanner',
//     loadComponent: () =>
//       import('../../super/scanner-parcel/scanner-parcel.component').then(m => m.ScannerParcelComponent)
//   },
//   {
//     path: 'supplier-salevoucher',
//     loadComponent: () =>
//       import('../../super/vouchers/vouchers.component').then(m => m.VouchersComponent)
//   }
];
