export interface SalePersonRequest {
  id?: string;          
  name: string;         
  phoneNumber: string;  
  email?: string;      
  cityId: number;
  address: string;    
  isActive: boolean;
  isDeleted: boolean;
}