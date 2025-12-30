import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenuModule } from 'primeng/menu';
import { ToolbarModule } from 'primeng/toolbar';
import { TabsModule } from 'primeng/tabs';
import { NgxBarcode6Module } from 'ngx-barcode6';
import { PrintService } from '../../../../../core/services/print-service';
import { SaleVoucherPrintResponse } from '../../../../../model/response/print/salevoucher-response-print';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-print',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MenuModule,
    ToolbarModule,
    CardModule,
    ButtonModule,
    BreadcrumbModule,
    TabsModule,
    NgxBarcode6Module
  ],
  templateUrl: './print.html',
  styleUrls: ['./print.css'],
})
export class Print {
  value:number=0;


  // ✅ Correct Signal Declaration
  printData = signal<SaleVoucherPrintResponse | null>(null);

  breadcrumbItems: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/supplier' },
    { label: 'Products' }
  ];
  
  constructor(
      private printService: PrintService,
      private route: ActivatedRoute,
      private router: Router
  ) {
    this.loadPrint();
  }

  loadPrint() {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      let id = Number(idParam);

      this.printService.supplierStickerSaleVoucherParcelPrint(id)
        .subscribe(result => {
          this.printData.set(result);   // ✅ correct signal update
          
        });
    }
  }

  printPage(id: string) {
  const printContents = document.getElementById(id)?.innerHTML;
  if (!printContents) return;

  const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
  popupWin!.document.open();
  popupWin!.document.write(`
    <html>
      <head>
        <title>Print</title>
        <link rel="stylesheet"
         href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">
      </head>
      <body onload="window.print();window.close()">
        ${printContents}
      </body>
    </html>`
  );
  popupWin!.document.close();
  }
  
  cancel()
  {
    this.router.navigate(['supplier/salevouchers']);
  }

  getTotalQty(): number 
  {   
      return (this.printData()?.billingDetailPrints || [])
     .reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
  }
}
