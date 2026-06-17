export interface SaleVoucherDto {
  id: number;
  lrNumber:string;
  supplierBillNumber?: string;
  supplierName?: string;
  date: string;
  isExported: boolean;
  department:string;
  parcelStatus:string;
}