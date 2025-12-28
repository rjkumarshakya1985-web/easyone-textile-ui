import { SupplierProductDto } from "../entity/products/supplier-product.model";


export interface SupplierProductView extends SupplierProductDto {
  wholeSalesMargin: number;
  retailMargin: number;
  mrpMargin: number;

  wholeSaleRate?: number;
  retailPrice?: number;
  mrpRate?: number;
}
