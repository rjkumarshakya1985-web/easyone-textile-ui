export interface CustomerRequest {
  id: string;                 // Guid → string
  name: string;
  alias?: string;
  ledgerName?: string;
  printName?: string;
  groupName?: string;
  gstIn?: string;
  pan?: string;
  regType?: number;
  billingAddress?: string;
  shippingAddress?: string;
  cityId: number;
  pinCode?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  contactPerson?: string;
  openingBalance?: number;
  creditDays?: number;
  creditLimit?: number;
  priceLevel?: number;
  tallyLedgerType?: number;
  tallyCategory?: number;
  customerType: number;
  remarks?: string;
}
