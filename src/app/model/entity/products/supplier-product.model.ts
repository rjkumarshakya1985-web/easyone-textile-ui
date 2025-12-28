import { ProductHsnCode } from "../../response/hsn-code.model";

export interface SupplierProductDto {
  id: string;                 // Guid → string
  supplierId: string;         // Guid → string
  stockGroupId: number;

  name: string;
  alias: string;
  printName: string;

  hsnCode: string;
  barcode: string;

  // Yes, No
  gstApplicable: boolean;

  // Goods, Services
  gstNature: number;

  // 1 = Taxable, 2 = Exempt, 3 = NilRated
  gstTaxability: number;

  purchaseRate: number;
  discount: number;

  isActive: boolean;
  isDeleted: boolean;

  createdBy: string;          // Guid → string
  createdByUserName: string;

  createdOn: string;          // DateTime → ISO string

  modifiedBy?: string;        // Guid? → optional string
  modifiedByUserName?: string;
  modifiedOn?: string;        // DateTime? → optional ISO string
  hsnCodeObj:ProductHsnCode
}
