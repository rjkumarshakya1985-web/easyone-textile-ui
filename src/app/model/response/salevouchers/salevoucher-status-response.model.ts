export interface SaleVoucherStatusView {
  id: string;                 
  saleVoucherId: number;
  date: string;               
  status: number;
  reason?: string;
  reasons?: string;
  createdBy: string;          
  createdByUserName: string;
  createdOn: string;          
}
