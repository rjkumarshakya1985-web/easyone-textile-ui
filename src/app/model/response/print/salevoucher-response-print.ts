export interface SaleVoucherPrintResponse {
  saleVoucherPrint: SaleVoucherPrint;
  supplierPrint:SupplierPrint;
  billingDetailPrints:BillingDetailPrint[];
  stickerPrints:StickerPrint[]
}

export interface SaleVoucherPrint {
  id: number;
  companyName: string;
  address: string;
  inVoiceNo: string;
  transportName: string;
  supplierBillNumber:string;
  discount:number;
  date: string; // ISO Date from API
  gstIn:string;
}

export interface SupplierPrint {
  name: string;
  supplierCode:string;
  gstIn:string;
}


export interface BillingDetailPrint
{
    productName:string;
    hsnCode:string;
    qty:number;
    purchasePrice:number;
    gst:number;
    discountAmount:number;
    total:number;
    cgst:number;
    sgst:number;
    igst:number;
    PayableAmount:number;
}

export interface StickerPrint {
  barcode: string;
  retailRate: string;
  purchaseRate: number;
  wholeSaleRate: string;
  mrpRate: string;
  supplierCode: string;
  name?: string | null;
  productName:string;
  printDateString:string;
}


