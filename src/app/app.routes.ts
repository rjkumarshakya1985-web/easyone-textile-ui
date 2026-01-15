import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { NotFoundRecord } from './components/not-found-record/not-found-record';
// q : Can I create separate fiel for chidren route 
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./features/login/login').then(m => m.Login) 
  },
  { 
    canActivate: [authGuard],
    path: 'supplier', 
    loadComponent: () => import('./layouts/supplier-layout/supplier-layout').then(m => m.SupplierLayout),
    children: [
      {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () => import('./layouts/supplier-layout/pages/dashboard/dashboard').then(c => c.Dashboard)
      },
      {
        path: 'products',
        canActivate: [authGuard],
        loadComponent: () => import('./layouts/supplier-layout/pages/products/product-list/product-list').then(c => c.ProductList)
      },
      {
        path: 'product/add',
        loadComponent: () => import('./layouts/supplier-layout/pages/products/add-product/add-product').then(c => c.AddProduct)
      },
      {
        path: 'product/edit/:id',
        loadComponent: () => import('./layouts/supplier-layout/pages/products/add-product/add-product').then(c => c.AddProduct)
      },
      {
        path: 'salevouchers',
        loadComponent: () => import('./layouts/supplier-layout/pages/salevouchers/salevoucher-list/salevoucher-list').then(c => c.SalevoucherList)
      },
      {
        path: 'salevoucher/add',
        loadComponent: () => import('./layouts/supplier-layout/pages/salevouchers/add-salevoucher/add-salevoucher').then(c => c.AddSalevoucher)
      },
       {
        path: 'salevoucher/edit/:id',
        loadComponent: () => import('./layouts/supplier-layout/pages/salevouchers/add-salevoucher/add-salevoucher').then(c => c.AddSalevoucher)
      },
       {
        path: 'print/:id',
        loadComponent: () => import('./layouts/supplier-layout/pages/prints/print/print').then(c => c.Print)
      },
       {
        path:'sticker-print/:id',
        loadComponent:() => import('./layouts/supplier-layout/pages/prints/sticker-print/sticker-print').then(x=>x.StickerPrint)
       },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { 
    path: 'admin', 
    canActivate: [roleGuard('SuperAdmin')],
    loadComponent: () => import('./layouts/admin-layout/admin-layout').then(m => m.AdminLayout),
    // Children are defined inside SupplierLayout using nested lazy loading:
    children: [
       {
        path: 'not-found',
        canActivate: [roleGuard('SuperAdmin')],
        loadComponent: () => import('./components/not-found-record/not-found-record').then(c => c.NotFoundRecord)
      },
      {
        path: 'dashboard',
        canActivate: [roleGuard('SuperAdmin')],
        loadComponent: () => import('./layouts/admin-layout/pages/dashboard/dashboard').then(c => c.Dashboard)
      },
      {
        path: 'gstrule',
        canActivate: [roleGuard('SuperAdmin')],
        loadComponent: () => import('./layouts/admin-layout/pages/gstrule/gst-rule-list/gst-rule-list').then(c => c.GstRuleList)
      },
      {
        path: 'hsncodes',
        canActivate: [roleGuard('SuperAdmin')],
        loadComponent: () => import('./layouts/admin-layout/pages/hsn-code/hsn-code-list/hsn-code-list').then(c => c.HsnCodeList)
      },
      {
        path: 'item-categories',
        canActivate: [roleGuard('SuperAdmin')],
        loadComponent: () => import('./layouts/admin-layout/pages/item-category/item-category-list/item-category-list').then(c => c.ItemCategoryList)
      },
      {
        path: 'item-category/add',
        canActivate: [roleGuard('SuperAdmin')],
        loadComponent: () => import('./layouts/admin-layout/pages/item-category/add-item-category/add-item-category').then(c => c.AddItemCategory)
      },
      {
        path: 'item-category/edit/:id',
        canActivate: [roleGuard('SuperAdmin')],
        loadComponent: () => import('./layouts/admin-layout/pages/item-category/add-item-category/add-item-category').then(c => c.AddItemCategory)
      },
      {
        path: 'transports',
        canActivate: [roleGuard('SuperAdmin')],
        loadComponent: () => import('./layouts/admin-layout/pages/transport/transport-list/transport-list').then(c => c.TransportList)
      },
      {
        path: 'transport/add',
        loadComponent: () => import('./layouts/admin-layout/pages/transport/add-transport/add-transport').then(c => c.AddTransport)
      },
      {
        path: 'transport/edit/:id',
        loadComponent: () => import('./layouts/admin-layout/pages/transport/update-transport/update-transport').then(c => c.UpdateTransport)
      },
      {
        path: 'suppliers',
        loadComponent: () => import('./layouts/admin-layout/pages/supplier/supplier-list/supplier-list').then(c => c.SupplierList)
      },
      {
        path: 'supplier/add',
        loadComponent: () => import('./layouts/admin-layout/pages/supplier/add-supplier/add-supplier').then(c => c.AddSupplier)
      },
      {
        path: 'supplier/edit/:id',
        loadComponent: () => import('./layouts/admin-layout/pages/supplier/add-supplier/add-supplier').then(c => c.AddSupplier)
      },
      {
        path: 'customers',
        loadComponent: () => import('./layouts/admin-layout/pages/customers/customer-ltst/customer-list').then(c => c.CustomerList)
      },
      {
        path: 'customer/add',
        loadComponent: () => import('./layouts/admin-layout/pages/customers/add-customer/add-customer').then(c => c.AddCustomer)
      },
      {
        path: 'customer/edit/:id',
        loadComponent: () => import('./layouts/admin-layout/pages/customers/update-customer/update-customer').then(c => c.UpdateCustomer)
      },
      {
        path: 'departments',
        canActivate: [roleGuard('SuperAdmin')],
        loadComponent: () => import('./layouts/admin-layout/pages/department/department-list/department-list').then(c => c.DepartmentList)
      },
      {
        path: 'sub-departments/:id',
        canActivate: [roleGuard('SuperAdmin')],
        loadComponent: () => import('./layouts/admin-layout/pages/subdepartment/subdepartment-list/subdepartment-list').then(c => c.SubdepartmentList)
      },
      {
        path: 'supplier-transports',
        canActivate: [roleGuard('SuperAdmin')],
        loadComponent: () => import('./layouts/admin-layout/pages/supplier-transport/supplier-transport-list/supplier-transport-list').then(c => c.SupplierTransportList)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
   { path: 'not-found', component: NotFoundRecord },
  { path: '**', redirectTo: '/login' }
 ,
];
