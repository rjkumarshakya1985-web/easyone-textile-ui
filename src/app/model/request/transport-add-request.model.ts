export interface TransportRequest {
  id: number;                     // uniqId
  name: string;                   // varchar
  cityId: number;                   // Id (foreign key)
  stateId: number;                // Id (foreign key)
  gstin?: string;                 // varchar (optional)
  registrationType: number;       // RegId (Regular / Composition / Unregistered)
  transportType : number;
  address: string;                // varchar
  pincode: string;                // varchar
  mobile: string;                 // varchar
  email?: string;                 // varchar (optional)
  remarks?: string;               // varchar (optional)
}