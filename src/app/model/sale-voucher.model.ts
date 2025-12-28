import { SaleVoucherProduct } from "./sale-voucher-product.model";

export type SaleVoucherStatus =
  | 'Ready'
  | 'Dispatched'
  | 'Transport'
  | 'Enter'
  | 'Open'
  | 'Cancel'
  | 'Return';

export interface SaleVoucher {
  id: number;                     // Primary Key
  date: string;                   // Datetime (ISO string recommended)
  transportId?: string;           // Unique ID
  numberOfPacket?: number;        // int
  supplierBillNumber?: number;    // int
  description?: string;           // varchar
  status: SaleVoucherStatus;      // Enum-like
  reason?: string;                // varchar
  supplierId: number;             // int

  // Optional: For UI listing
  products?: SaleVoucherProduct[];
}
