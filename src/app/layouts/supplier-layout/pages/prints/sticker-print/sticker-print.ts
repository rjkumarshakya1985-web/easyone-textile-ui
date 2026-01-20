import { Component, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { PrintService } from '../../../../../core/services/print-service';
import { ActivatedRoute, Router } from '@angular/router';
import { StickerPrint } from '../../../../../model/response/print/salevoucher-response-print';
import { NgxBarcode6Module } from 'ngx-barcode6';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sticker-print',
  imports: [CommonModule, ToolbarModule,BreadcrumbModule,
    ButtonModule,CardModule,NgxBarcode6Module],
  templateUrl: './sticker-print.html',
  styleUrl: './sticker-print.css',
})
export class ProductStickerPrint {

  printData = signal<StickerPrint | null>(null);
  breadcrumbItems: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/supplier' },
    { label: 'Print Sticker' }
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
      let id = idParam;

      this.printService.productBarcodeSticker(id)
        .subscribe(result => {
          this.printData.set(result);   // ✅ correct signal update
          
        });
    }
  }
  printSticker(id: string) {
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
}
