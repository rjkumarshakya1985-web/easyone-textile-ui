    export interface SaleVoucherDetail
    {

        id?: string | null;
        stockGroupId:number;
        stockGroupName:string;
        productId:string;
        productName:string;
        purchasePrice:number;
        qty:number;
        wholeSalePrice:number;
        retailPrice:number;
        mrpPrice:number;
        isSupplierDiscount:boolean;
    }