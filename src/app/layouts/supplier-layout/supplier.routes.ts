import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const SUPPLIER_ROUTES: Routes = [
  {
    path: 'change-password',
    loadComponent: () =>
      import('./pages/force-change-password/force-change-password').then(c => c.ForceChangePassword)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then(c => c.Dashboard)
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/products/product-list/product-list').then(c => c.ProductList)
  },
  {
    path: 'product/add',
    loadComponent: () =>
      import('./pages/products/add-product/add-product').then(c => c.AddProduct)
  },
  {
    path: 'product/edit/:id',
    loadComponent: () =>
      import('./pages/products/add-product/add-product').then(c => c.AddProduct)
  },
  {
    path: 'salevouchers',
    loadComponent: () =>
      import('./pages/salevouchers/salevoucher-list/salevoucher-list')
        .then(c => c.SalevoucherList)
  },
  {
    path: 'salevoucher/add',
    loadComponent: () =>
      import('./pages/salevouchers/add-salevoucher/add-salevoucher')
        .then(c => c.AddSalevoucher)
  },
  {
    path: 'salevoucher/edit/:id',
    loadComponent: () =>
      import('./pages/salevouchers/add-salevoucher/add-salevoucher')
        .then(c => c.AddSalevoucher)
  },
    {
      path: 'salevoucher-detail/:id',
      loadComponent: () =>
        import('../admin-layout/pages/supplier-salevoucher/supplier-salevoucher-detail/supplier-salevoucher-detail')
          .then(c => c.SupplierSalevoucherDetail)
    },
  {
    path: 'print/:id',
    loadComponent: () =>
      import('./pages/prints/print/print').then(c => c.Print)
  },
  {
    path: 'sticker-print/:id',
    loadComponent: () =>
      import('./pages/prints/sticker-print/sticker-print')
        .then(c => c.ProductStickerPrint)
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
