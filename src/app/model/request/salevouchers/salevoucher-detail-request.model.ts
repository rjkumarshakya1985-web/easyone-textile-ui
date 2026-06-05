export interface SaleVoucherDetailRequest {
  id?: string;
  saleVoucherId?: number;
  productId: string;
  quantity: number;
  IsSupplierDiscount:boolean;
}