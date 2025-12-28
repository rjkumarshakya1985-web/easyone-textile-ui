import { Transport } from "../../transporter.model";

export interface SupplierTransportResponse {
  id: string;
  supplierId: string;
  code: string;
  name: string;
  transportResponses: Transport[];
}