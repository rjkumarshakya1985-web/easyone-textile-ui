import { DashboardParcel } from "./dashboard.model";

export interface AdminDashboardResponse {
  supplierCount: number;
  customerCount: number;
  inParcel: number;
  openParcel: number;
  inTransitLatestSaleVouchers: DashboardParcel[];
  inHouseLatestSaleVouchers: DashboardParcel[];
}
