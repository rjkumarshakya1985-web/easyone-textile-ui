import { SaleVoucherDetailRequest } from "./salevoucher-detail-request.model";

export interface SaleVoucherRequest {
  id?: number;
  supplierId?: string;
  transportId: number;
  date: string; // ISO date string
  numberOfParcel: number;
  supplierBillNumber: string;
  additionalCharges?:number;
  status: number;
  remarks?: string;
  isActive: boolean;
  saleVoucherDetails: SaleVoucherDetailRequest[];
}


