export interface SupplierProductRequest {
  id: string;              // Guid → string
  supplierId: string;      // Guid → string
  stockGroupId: number;

  name: string;
  alias: string;
  printName: string;

  hsnCode: string;
  barcode: string;

  // Yes / No
  gstApplicable: boolean;

  // Goods = 1, Services = 2
  gstNature: number;

  // 1 = Taxable, 2 = Exempt, 3 = NilRated
  gstTaxability: number;

  purchaseRate: number;    // decimal → number
  discount: number;

  isActive: boolean;
  isDeleted: boolean;
}
