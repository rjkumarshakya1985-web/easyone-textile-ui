export interface StockLedgerView {
  stockGroupName: string;
  productName: string;
  date: string;          // DateTime -> string (ISO format from API)
  billNo?: number | null;
  description: string;
  in?: number | null;
  out?: number | null;
  balance: number;
}