import { StockTableResponse } from "./stock-table-response.model";

export interface StockAdjustmentResponse {
  stock: StockTableResponse;
  adjustments: StockAdjustmentDetailsResponse[];
}

export interface StockAdjustmentDetailsResponse {
  id: string; // Guid -> string
  stockId: string; // Guid -> string
  systemQty: number;
  adjustmentQty: number;
  newQty: number;
  adjustmentType: number;
  reason?: string | null;
  createdOn: string; // DateTime -> ISO string
  createdByUserName: string;
}