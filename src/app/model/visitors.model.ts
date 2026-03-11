export interface Visitors {
  id: number;                   // Primary Key
  customerId:string;
  name: string;

  registrationType?: 'Regular' | 'Composition' | 'Unregistered';
customerType?:'WholeSaler' |'Retailer';

  cityId?: number;               // Depends on your DB (string or ID)
  stateId?: number;
  stateCode?: string;
  mobile?: string;
  remarks?: string;
  visitDate?:Date;
  createdDate?: Date;
  modifiedDate?: Date;
}
