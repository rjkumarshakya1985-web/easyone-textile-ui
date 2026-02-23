import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const ADMIN_ROUTES: Routes = [

  // =========================
  // Dashboard
  // =========================
  {
    path: 'dashboard',
    canActivate: [roleGuard('SuperAdmin')],
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then(c => c.Dashboard)
  },

  // =========================
  // GST
  // =========================
  {
    path: 'gstrule',
    canActivate: [roleGuard('SuperAdmin')],
    loadComponent: () =>
      import('./pages/gstrule/gst-rule-list/gst-rule-list')
        .then(c => c.GstRuleList)
  },

  // =========================
  // Masters
  // =========================
  {
    path: 'hsncodes',
    canActivate: [roleGuard('SuperAdmin')],
    loadComponent: () =>
      import('./pages/hsn-code/hsn-code-list/hsn-code-list')
        .then(c => c.HsnCodeList)
  },
  {
    path: 'item-categories',
    canActivate: [roleGuard('SuperAdmin')],
    loadComponent: () =>
      import('./pages/item-category/item-category-list/item-category-list')
        .then(c => c.ItemCategoryList)
  },
  {
    path: 'item-category/add',
    canActivate: [roleGuard('SuperAdmin')],
    loadComponent: () =>
      import('./pages/item-category/add-item-category/add-item-category')
        .then(c => c.AddItemCategory)
  },
  {
    path: 'item-category/edit/:id',
    canActivate: [roleGuard('SuperAdmin')],
    loadComponent: () =>
      import('./pages/item-category/add-item-category/add-item-category')
        .then(c => c.AddItemCategory)
  },

  // =========================
  // Transport
  // =========================
  {
    path: 'transports',
    canActivate: [roleGuard('SuperAdmin')],
    loadComponent: () =>
      import('./pages/transport/transport-list/transport-list')
        .then(c => c.TransportList)
  },
  {
    path: 'transport/add',
    canActivate: [roleGuard('SuperAdmin')],
    loadComponent: () =>
      import('./pages/transport/add-transport/add-transport')
        .then(c => c.AddTransport)
  },
  {
    path: 'transport/edit/:id',
    canActivate: [roleGuard('SuperAdmin')],
    loadComponent: () =>
      import('./pages/transport/update-transport/update-transport')
        .then(c => c.UpdateTransport)
  },

  // =========================
  // Users
  // =========================
  {
    path: 'users',
    canActivate: [roleGuard('SuperAdmin')],
    loadComponent: () =>
      import('./pages/users/user-list/user-list')
        .then(c => c.UserList)
  },

  // =========================
  // Suppliers
  // =========================
  {
    path: 'suppliers',
    canActivate: [roleGuard('SuperAdmin')],
    loadComponent: () =>
      import('./pages/supplier/supplier-list/supplier-list')
        .then(c => c.SupplierList)
  },
  {
    path: 'supplier/add',
    canActivate: [roleGuard('SuperAdmin')],
    loadComponent: () =>
      import('./pages/supplier/add-supplier/add-supplier')
        .then(c => c.AddSupplier)
  },
  {
    path: 'supplier/edit/:id',
    canActivate: [roleGuard('SuperAdmin')],
    loadComponent: () =>
      import('./pages/supplier/add-supplier/add-supplier')
        .then(c => c.AddSupplier)
  },
  // =========================
// Agents
// =========================
{
  path: 'agents',
  canActivate: [roleGuard('SuperAdmin')],
  loadComponent: () =>
    import('./pages/agents/agent-list/agent-list')
      .then(c => c.AgentList)
},
{
  path: 'agent/add',
  canActivate: [roleGuard('SuperAdmin')],
  loadComponent: () =>
    import('./pages/agents/add-agent/add-agent')
      .then(c => c.AddAgent)
},
{
  path: 'agent/edit/:id',
  canActivate: [roleGuard('SuperAdmin')],
  loadComponent: () =>
    import('./pages/agents/add-agent/add-agent')
      .then(c => c.AddAgent)
},

  // =========================
  // Customers
  // =========================
  {
    path: 'customers',
    canActivate: [roleGuard('SuperAdmin')],
    loadComponent: () =>
      import('./pages/customers/customer-ltst/customer-list')
        .then(c => c.CustomerList)
  },
  {
    path: 'customer/add',
    canActivate: [roleGuard('SuperAdmin')],
    loadComponent: () =>
      import('./pages/customers/add-customer/add-customer')
        .then(c => c.AddCustomer)
  },
  {
    path: 'customer/edit/:id',
    canActivate: [roleGuard('SuperAdmin')],
    loadComponent: () =>
      import('./pages/customers/add-customer/add-customer')
        .then(c => c.AddCustomer)
  },
  // =========================
  // Departments
  // =========================
  {
    path: 'departments',
    canActivate: [roleGuard('SuperAdmin')],
    loadComponent: () =>
      import('./pages/department/department-list/department-list')
        .then(c => c.DepartmentList)
  },
  {
    path: 'sub-departments/:id',
    canActivate: [roleGuard('SuperAdmin')],
    loadComponent: () =>
      import('./pages/subdepartment/subdepartment-list/subdepartment-list')
        .then(c => c.SubdepartmentList)
  },

  // =========================
  // Supplier Configurations
  // =========================
  {
    path: 'supplier-transports',
    canActivate: [roleGuard('SuperAdmin')],
    loadComponent: () =>
      import('./pages/supplier-transport/supplier-transport-list/supplier-transport-list')
        .then(c => c.SupplierTransportList)
  },
  {
    path: 'supplier-stockgroups',
    canActivate: [roleGuard('SuperAdmin')],
    loadComponent: () =>
      import('./pages/supplier-category/supplier-category-list')
        .then(c => c.SupplierCategoryList)
  },
  {
    path: 'supplier-hsncode',
    canActivate: [roleGuard('SuperAdmin')],
    loadComponent: () =>
      import('./pages/supplier-hsncode/supplier-hsncode-list')
        .then(c => c.SupplierHsnCodeList)
  },

  // =========================
  // Supplier Products & Sales
  // =========================
  {
    path: 'supplier-products',
    canActivate: [roleGuard('SuperAdmin')],
    loadComponent: () =>
      import('./pages/products/product-list/product-list')
        .then(c => c.ProductList)
  },
   {
    path: 'supplier-product/add',
    canActivate: [roleGuard('SuperAdmin')],
    loadComponent: () =>
      import('./pages/products/add-product/add-product')
        .then(c => c.AddProduct)
  },
  {
    path: 'supplier-product/:id',
    canActivate: [roleGuard('SuperAdmin')],
    loadComponent: () =>
      import('./pages/products/add-product/add-product')
        .then(c => c.AddProduct)
  },
  {
    path: 'show-supplier-product/:id',
    canActivate: [roleGuard('SuperAdmin')],
    loadComponent: () =>
      import('./pages/products/show-product/show-product')
        .then(c => c.ShowProduct)
  },
  {
    path: 'supplier-salevoucher',
    canActivate: [roleGuard('SuperAdmin')],
    loadComponent: () =>
      import('./pages/supplier-salevoucher/supplier-salevoucher-list/supplier-salevoucher-list')
        .then(c => c.SupplierSalevoucherList)
  },
  {
    path: 'supplier-salevoucher-detail/:id',
    canActivate: [roleGuard('SuperAdmin')],
    loadComponent: () =>
      import('./pages/supplier-salevoucher/supplier-salevoucher-detail/supplier-salevoucher-detail')
        .then(c => c.SupplierSalevoucherDetail)
  },

  // =========================
  // Print
  // =========================
  {
    path: 'print/:id',
    canActivate: [roleGuard('SuperAdmin')],
    loadComponent: () =>
      import('../supplier-layout/pages/prints/print/print')
        .then(c => c.Print)
  },

  /// Parcel
 {
    path: 'parcel-scanners/:status',
    loadComponent: () =>
      import('../store-operator-layout/pages/parcel-scanners/parcel-scanners')
        .then(c => c.ParcelScanners)
  },  
  {
    path: 'stocks',
    loadComponent: () =>
      import('./pages/stocks/stock-list/stock-list')
        .then(c => c.StockList)
  },
  {
    path: 'stock-transactions',
    loadComponent: () =>
      import('./pages/stocks/stock-ledger-list/stock-ledger-list')
        .then(c => c.StockLedgerList)
  },
  ///
  // =========================
  // Default
  // =========================
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
