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
  departmentName:string;
  isExported:boolean;
  lrNumber:string;
  lrDate:Date;
  statusDate:Date;
}

export interface SaleVoucherMobileResponse {
  id: number;
  supplierName?: string;
  date: string;
  supplierInvoice?: string;
  companyName?: string;
  floor?: string;
  parcelStatus: ParcelStatus;
  statusDate: string;
  totalQuantity: number;
  products: SaleVoucherMobileProductResponse[];
}

export interface SaleVoucherMobileProductResponse {
  categoryName?: string;
  productName?: string;
  description?: string;
  barcode?: string;
  quantity: number;
}

