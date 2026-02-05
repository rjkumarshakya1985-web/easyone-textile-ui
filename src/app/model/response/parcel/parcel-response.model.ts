import { ParcelView } from "../../views/parcel-view.model";

export interface ParcelResponse {
  saleVoucher?: ParcelView | null;
  isAvailable: boolean;
  message?: string | null;
}