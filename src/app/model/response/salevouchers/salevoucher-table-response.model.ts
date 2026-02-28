import { ParcelStatus } from "../../../core/enums/enum";

export interface SaleVoucherTableResponse {
  id: number;
  date: string;              // ISO string from API
  tranportName: string;
  supplierName:string;
  numberOfParcel: number;
  billNumber: string;
  parcelStatus: ParcelStatus;
  productDetails:string;
}

