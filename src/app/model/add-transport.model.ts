export interface Transport {
    id: number;               
    name: string;
    cityId: number;
    gstIn?: string | null;
    registrationType: number;
    address?: string | null;
    pincode?: string | null;
    mobile?: string | null;
    email?: string | null;
    remarks?: string | null;
    isActive: boolean;
    isDeleted: boolean;
}
