export interface SupplierRequest {
  id: string; // Guid in C# → string in TS
  userName: string;
  subDepartmentId?: number;
  code: string;
  name?: string;
  alias?: string;

  gstIn?: string;
  pan?: string;
  regType?: number;
  address?: string;
  cityId?: number;

  mobile?: string;
  email?: string;
  contactPerson?: string;

  bankName?: string;
  branch?: string;
  accountNumber?: string;
  ifsc?: string;
  upid?: string;

  creditDays?: number;
  creditLimit?: number;

  gstRegistrationDate?: string; // DateTime → string (ISO format)
  msmeNumber?: string;
  eccNumber?: string;
  remarks?: string;

  discountType: number;
  transactionType?: number;

  wholeSalesMargin: number;
  retailMargin: number;

  billDiscount?:number,
  paymentDiscount?:number,
  annualIncentive?:number,
}
