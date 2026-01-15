export interface GstRuleRequest {
  id: number;
  stockGroupId: number;
  gstValue: number;
  startRange: number;
  endRange?: number | null;
  isDeleted: boolean;
}
