export interface SaleVoucherProduct {
  id: string;          // Unique ID  
  saleVoucherId: number;
  productId: string;   // Unique product ID
  quantity: number;
}