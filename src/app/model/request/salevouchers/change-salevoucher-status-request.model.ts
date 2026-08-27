export interface ChangeSaleVoucherStatusRequest {
  saleVoucherId: number;
  status: number;
  reason?: string;
}
