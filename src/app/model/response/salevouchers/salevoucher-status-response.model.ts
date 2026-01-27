export interface SaleVoucherStatusView {
  id: string;                 
  saleVoucherId: number;
  date: string;               
  status: number;
  reason?: string;
  createdBy: string;          
  createdByUserName: string;
  createdOn: string;          
}
