import { DashboardParcel } from "./dashboard.model";

export interface SupplierDashboardResponse {
  productCount: number;
  inTransitParcelCount: number;
  transportParcelCount: number;
  atLocationParcelCount: number;
  openParcelCount: number;
  saleVoucherCount: number;
  latestSaleVouchers: DashboardParcel[];
  latestOpenSaleVouchers: DashboardParcel[];
}
