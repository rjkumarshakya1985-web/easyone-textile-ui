export interface AgentTableResponse {
  id: string;
  name?: string | null;
  contactPersonName?:string|null;
  contactPersonMobile?:string | null;
  gstin?: string | null;
  pan?: string | null;
  email?:string | null;
  pincode?:string | null;
  tallyLedgerName?:string | null;
  area?:string | null;
  city?: string | null;
  state?: string | null;
  address?: string | null;
  isActive: boolean;
}
