export interface GstRuleDto {
  id: number;
  stockGroupId: number;
  stockGroupName:string;
  gstValue: number;
  startRange: number;
  endRange?: number | null;
  isDeleted: boolean;
}