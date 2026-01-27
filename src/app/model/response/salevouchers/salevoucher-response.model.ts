export interface SaleVoucherResponse {
  id: number;
  supplierId: string;          // Guid → string
  supplierName:string;
  transportId: number;
  transportName:string;
  date: string;                // DateTime → ISO string
  numberOfParcel: number;
  supplierBillNumber: string;
  status: number;
  remarks?: string | null;
  details: SaleVoucherDetailResponse[];
}

export interface SaleVoucherDetailResponse {
  id:string;
  categoryId:number;
  categoryName: string;
  productId: string;           // Guid → string
  productName: string;
  quantity: number;
  purchasePrice: number;
  wholeSalePrice: number;
  retailPrice: number;
  mrpPrice: number;
}
