export interface TableDataRequest {
    pageSize: number;
    pageIndex: number;
    search?: string;

    // Sorting (PrimeNG compatible)
    sortField?: string;   // e.g. 'supplierName'
    sortOrder?:number;   // 1 = ASC, -1 = DESC
    filters?: { [key: string]: string | null };
}
