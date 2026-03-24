export interface SalePersonResponse {
  id?: string;          
  name: string;         
  phoneNumber: string;  
  email?: string; 
  stateId:number;     
  stateName:string;
  cityId: number;
  cityName:string;
  address: string;    
  isActive: boolean;
  isDeleted: boolean;
}