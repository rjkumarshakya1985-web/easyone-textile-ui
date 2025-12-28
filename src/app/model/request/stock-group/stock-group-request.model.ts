export interface StockGroupRequest {
  id?: number | null;
  name: string;
  gstValue: number;
  isGstRule: boolean;
  description: string;
  isActive: boolean;
}
