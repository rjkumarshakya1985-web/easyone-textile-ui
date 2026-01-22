import { DashboardParcel } from "./dashboard.model";

export interface SupplierDashboardResponse {
  productCount: number;
  inTransitParcelCount: number;
  saleVoucherCount: number;
  latestSaleVouchers: DashboardParcel[];
}
