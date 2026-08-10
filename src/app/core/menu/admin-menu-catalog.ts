export interface AdminMenuCatalogItem {
  key: string;
  label: string;
  parentKey?: string;
}

export const ADMIN_MENU_CATALOG: AdminMenuCatalogItem[] = [
  { key: 'admin.dashboard', label: 'Dashboard' },
  { key: 'admin.gstrule', label: 'GST Rules' },
  { key: 'admin.masters', label: 'Masters' },
  { key: 'admin.hsncodes', label: 'HSN Codes', parentKey: 'admin.masters' },
  { key: 'admin.transports', label: 'Transports', parentKey: 'admin.masters' },
  { key: 'admin.departments', label: 'Departments', parentKey: 'admin.masters' },
  { key: 'admin.item-categories', label: 'Product Categories', parentKey: 'admin.masters' },
  { key: 'admin.people', label: 'People' },
  { key: 'admin.users', label: 'Users', parentKey: 'admin.people' },
  { key: 'admin.customers', label: 'Customers', parentKey: 'admin.people' },
  { key: 'admin.customer-agents', label: 'Customer Agents', parentKey: 'admin.people' },
  { key: 'admin.agents', label: 'Supplier Agents', parentKey: 'admin.people' },
  { key: 'admin.sales-persons', label: 'Sales Persons', parentKey: 'admin.people' },
  { key: 'admin.suppliers', label: 'Suppliers' },
  { key: 'admin.supplier-list', label: 'Supplier List', parentKey: 'admin.suppliers' },
  { key: 'admin.supplier-transports', label: 'Supplier Transports', parentKey: 'admin.suppliers' },
  { key: 'admin.supplier-stockgroups', label: 'Supplier Categories', parentKey: 'admin.suppliers' },
  { key: 'admin.supplier-hsncode', label: 'Supplier HSN Code', parentKey: 'admin.suppliers' },
  { key: 'admin.supplier-products', label: 'Supplier Products', parentKey: 'admin.suppliers' },
  { key: 'admin.supplier-salevoucher', label: 'Supplier Sale Voucher', parentKey: 'admin.suppliers' },
  { key: 'admin.parcel-management', label: 'Parcel Management' },
  { key: 'admin.transit-scanning', label: 'Transit Scanning', parentKey: 'admin.parcel-management' },
  { key: 'admin.warehouse-scanning', label: 'Warehouse Scanning', parentKey: 'admin.parcel-management' },
  { key: 'admin.packed-location', label: 'Packed at Location', parentKey: 'admin.parcel-management' },
  { key: 'admin.stock-management', label: 'Stock Management' },
  { key: 'admin.stocks', label: 'Current Stock', parentKey: 'admin.stock-management' },
  { key: 'admin.stock-transactions', label: 'Stock Transactions', parentKey: 'admin.stock-management' },
  { key: 'admin.reports', label: 'Reports' },
  { key: 'admin.sales-report', label: 'Sales Report', parentKey: 'admin.reports' },
  { key: 'admin.purchase-report', label: 'Purchase Report', parentKey: 'admin.reports' },
  { key: 'admin.menu-access', label: 'Menu Access' },
  { key: 'admin.sticker-print-setting', label: 'Sticker Settings' }
];
