import { ProductHsnCode } from "../../hsn-code.model";

export interface SupplierHsnCodeResponse {
  id: string;              // Guid -> string
  supplierId: string;      // Guid -> string
  code: string;
  name: string;
  stockGroupId:number;
  stockGroupName:string;
  hsnCodeResponses: ProductHsnCode[];
}