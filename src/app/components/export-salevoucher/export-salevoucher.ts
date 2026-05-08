import { Component, signal } from '@angular/core';
import { SaleVoucherService } from '../../core/services/salevoucher.service';
import { SaleVoucherDto } from '../../model/dto/sale-voucher.model';
import { DataViewModule } from 'primeng/dataview';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-export-salevoucher',
  imports: [CommonModule, DataViewModule, ButtonModule,TableModule,CardModule],
   standalone: true,
  templateUrl: './export-salevoucher.html',
  styleUrl: './export-salevoucher.css',
})
export class ExportSalevoucher {

    dataList = signal<SaleVoucherDto[]>([]);

   constructor(private saleVoucherService:SaleVoucherService
     ) {
    
    }

     ngOnInit() {
    this.loadExportSaleVoucher(); // ✅ better here
  }
    
  loadExportSaleVoucher() {
    this.saleVoucherService.getExportedList().subscribe({
      next: (result) => {
        this.dataList.set(result);
         console.log(this.dataList());
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

 exportAll() {

  if (!this.dataList().length) return;

  const data = this.dataList().map(item => ({
    'Lr No': item.lrNumber,
    'Supplier Bill No': item.supplierBillNumber || '-',
    'Supplier Name': item.supplierName || '-',
    'Date': new Date(item.date).toLocaleDateString('en-GB')
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = {
    Sheets: { 'Vouchers': worksheet },
    SheetNames: ['Vouchers']
  };

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  });

  this.saveAsExcelFile(excelBuffer, 'Sale_Vouchers');
}

saveAsExcelFile(buffer: any, fileName: string): void {
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.xlsx`;
  link.click();

  window.URL.revokeObjectURL(url);
}
formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-GB'); 
}
}
