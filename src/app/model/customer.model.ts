export interface Customer {
  id: number;                   // Primary Key
  customerName: string;
  alias?: string;
  ledgerName?: string;
  printName?: string;
  groupName?: string;

  gstin?: string;
  pan?: string;
  registrationType?: 'Regular' | 'Composition' | 'Unregistered';

  billingAddress?: string;
  shippingAddress?: string;

  cityId?: number;               // Depends on your DB (string or ID)
  stateId?: number;
  stateCode?: string;
  pin?: string;
  country?: string;

  phone?: string;
  mobile?: string;
  email?: string;
  contactPerson?: string;

  openingBalance?: number;
  drCr?: 'Dr' | 'Cr';                  // Debit/Credit

  creditDays?: number;
  creditLimit?: number;

  priceLevel?: string;
  tallyLedgerType?: string;
  tallyCategory?: string;

  remarks?: string;
  createdDate?: Date;
  modifiedDate?: Date;
}
