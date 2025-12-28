export interface Product {
  id: number;                      // Primary key
  supId?: string;                  // Supplier Product ID
  name: string;
  alias?: string;
  printName?: string;

  groupId?: number;
  categoryId?: number;

  hsnCode?: string;
  barcode?: string;

  unit?: string;

  gstApplicable?: 'Y' | 'N';
  gstNature?: 'Goods' | 'Services';
  gstTaxability?: 'Taxable' | 'Exempt' | 'NilRated';
  gstRate?: number;

  purchaseRate?: number;
  wholeSaleRate?: number;
  retailRate?: number;
}
