export interface SupplierTableResponse {
  id: string;
  code: string;
  name?: string | null;

  userName: string;
  password: string;

  mobile?: string | null;
  gstIn?: string | null;
  pan?: string | null;

  city?: string | null;
  state?: string | null;
  address?: string | null;

  isActive: boolean;
}
