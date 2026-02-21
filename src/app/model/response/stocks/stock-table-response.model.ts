export interface StockTableResponse {
  id: string; // Guid -> string
  supplierName: string;
  productId: string; // Guid -> string

  barcode: string;
  productName: string;
  stockGroup:string;
  openingQty: number;
  inwardQty: number;
  outwardQty: number;
  reservedQty: number;
  damagedQty: number;
  totalQty: number;
  availableQty: number;

  purchaseRate?: number | null;
  discount?: number | null;
  wholeSaleMargin?: number | null;
  retailMargin?: number | null;
  mrpMargin?: number | null;

  wholeSaleRate?: number | null;
  retailRate?: number | null;
  mrpRate?: number | null;

  createdAt: string;      // DateTime -> ISO string
  updatedAt?: string | null; // Nullable DateTime
}