export interface AgentRequest {
  id: string; // Guid in C# → string in TS
  name?: string;
  contactPersonName?: string;
  contactPersonMobile?: string;
  gstin?: string;
  pan?: string;
  address?: string;
  cityId?: number;
  email?: string;
  tallyLedgerName?: string;
  area?: string;
  pincode?: string;
  

}
