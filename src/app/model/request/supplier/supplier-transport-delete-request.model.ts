export interface SupplierTransportDeleteRequest {
    supplierId: string;
    transportId: number;
}

export interface  SupplierStockGroupDeleteRequest
{
    supplierId: string;
    stockGroupId: number;
}

export interface SupplierHsnCodeRequest
{
    supplierId: string;
    hsnCodeId:string;
    stockGroupId:number;
}