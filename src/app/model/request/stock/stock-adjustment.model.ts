export interface StockAdjustmentRequest {
  stockId: string;     
  systemQty: number;   
  adjustmentQty: number;
  newQty: number;
  adjustmentType: number;
  reason?: string;          
}