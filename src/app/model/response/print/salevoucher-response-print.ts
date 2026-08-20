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
  applyWholeSaleRateCode: boolean;
  wholeSaleRateCodeDigitCount: number;
  wholeSaleRateCode0: string;
  wholeSaleRateCode1: string;
  wholeSaleRateCode2: string;
  wholeSaleRateCode3: string;
  wholeSaleRateCode4: string;
  wholeSaleRateCode5: string;
  wholeSaleRateCode6: string;
  wholeSaleRateCode7: string;
  wholeSaleRateCode8: string;
  wholeSaleRateCode9: string;
  stickerWidthMm?: number | null;
  stickerHeightMm?: number | null;
  hasCustomSize?: boolean;
  fieldSettings: StickerPrintFieldSetting[];
}

export interface SupplierStickerSizeSetting {
  stickerWidthMm?: number | null;
  stickerHeightMm?: number | null;
  hasCustomSize: boolean;
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

export interface SaleVoucherPrintDetailSetting {
  id: number;
  companyName: string;
  address1: string;
  address2?: string | null;
  description?: string | null;
  gstIn?: string | null;
}

