export interface SaleVoucherDto {
  id: number;
  supplierBillNumber?: string;
  supplierName?: string;
  date: string;
  isExported: boolean;
}