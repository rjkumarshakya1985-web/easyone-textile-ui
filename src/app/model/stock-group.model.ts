import { GstRuleDto } from "./response/gstrule/gstrule-response.model";

export interface StockGroup {
  id: number;
  name: string;
  gstValue: number;
  description: string;
  isGstRule: boolean;
  isActive: boolean;
  isDeleted: boolean;
  gstRuleDtos :GstRuleDto[]
}