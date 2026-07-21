export interface Supplier {
  id: string;
  userId: string;
  userName:string;
  departmentId:number;
  subDepartmentId?: number;
  code: string;
  name?: string;
  alias?: string;

  gstIn?: string;
  pan?: string;

  regType?: number;
  address?: string;

  cityId?: number;
  stateId?:number;

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

  gstRegistrationDate?: Date;

  msmeNumber?: string;
  eccNumber?: string;
  remarks?: string;

  discountType: number;
  transactionType?: number;

  wholeSalesMargin: number;
  retailMargin: number;
  mrpMargin:number;
  transportIds?: number[];
}
