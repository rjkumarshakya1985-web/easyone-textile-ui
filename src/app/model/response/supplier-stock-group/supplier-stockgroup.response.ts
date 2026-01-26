import { StockGroup } from "../../stock-group.model";

export interface SupplierStockGroupResponse {
  id: string;          // Guid → string
  supplierId: string;  // Guid → string
  code: string;
  name: string;
  stockGroupResponses: StockGroup[];
}