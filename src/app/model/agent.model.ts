export interface Agent {
  id: string;
  agentName?: string;
  contactPersonName?: string;
  contactPersonMobile?: string;
  email?: string;
  gstin?: string;
  pan?: string;
  address?: string;

  cityId?: number;
  stateId?:number;


  pincode?: string;
  tallyLedgerName?: string;
  area?: string;

}
