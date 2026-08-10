export interface SaleVoucherPrintResponse {
  saleVoucherPrint: SaleVoucherPrint;
  supplierPrint:SupplierPrint;
  billingDetailPrints:BillingDetailPrint[];
  stickerPrints:StickerPrint[];
  stickerSetting?: StickerPrintSetting;
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
  department:string;
  subDepartment:string;
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
    payableAmount:number;
    supplierDiscount:number
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
  stickerSetting?: StickerPrintSetting;
}

export interface StickerPrintSetting {
  showSupplierCode: boolean;
  showCompanyShortName: boolean;
  showWholeSaleRate: boolean;
  showProductName: boolean;
  showPrintDate: boolean;
  showRetailRate: boolean;
  showBarcode: boolean;
  showBarcodeText: boolean;
  companyShortName: string;
  applyWholeSaleRateFormula: boolean;
  wholeSaleRatePrefix?: string | null;
  wholeSaleRatePostfix?: string | null;
  wholeSaleRateAddAmount: number;
  fieldSettings: StickerPrintFieldSetting[];
}

export interface StickerPrintFieldSetting {
  fieldKey: string;
  label: string;
  isVisible: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontWeight: string;
  textAlign: 'left' | 'center' | 'right' | string;
  sortOrder: number;
}

