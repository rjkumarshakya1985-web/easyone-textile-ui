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
import { SaleVoucherPrintResponse, StickerPrint, StickerPrintFieldSetting } from '../../../../../model/response/print/salevoucher-response-print';
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
  
  value:number = 0;


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
        <style>${this.stickerPrintStyles()}</style>
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
  getTotalAmount():number
  {
    //purchasePrice
    return (this.printData()?.billingDetailPrints || [])
    .reduce(
      (sum, item) =>
        sum + (Number(item.qty) || 0) * (Number(item.purchasePrice) || 0),
      0
    );
  }
  getTotalDiscAmount():number
  {
   return (this.printData()?.billingDetailPrints || [])
    .reduce(
      (sum, item) =>
        sum + (Number(item.discountAmount) || 0),
      0
    );
  } 
  getRowCGST(): number {
  return (this.printData()?.billingDetailPrints || [])
    .reduce(
      (sum, item) =>
        sum + (Number(item.cgst) || 0),
      0
);
}
 getRowSGST(): number {
  return (this.printData()?.billingDetailPrints || [])
    .reduce(
      (sum, item) =>
        sum + (Number(item.sgst) || 0),
      0
);
}
getRowIGST(): number {
   return (this.printData()?.billingDetailPrints || [])
    .reduce(
      (sum, item) =>
        sum + (Number(item.igst) || 0),
      0
);
}
getTotalPayableAmount(): number {
   return (this.printData()?.billingDetailPrints || [])
    .reduce(
      (sum, item) =>
        sum + (Number(item.payableAmount) || 0),
      0
  );
}
getItemSummary(): string {
  const items = this.printData()?.billingDetailPrints;

  if (!items || items.length === 0) {
    return '';
  }

  if (items.length <= 2) {
    return items.map((x: any) => x.productName).join(', ');
  }

  return `${items[0].productName}, ${items[1].productName} +${items.length - 2} More`;
}

 addPrefixIfThreeDigit(value: number | undefined): string {
  if(!value) 
  {
    return '';
  }
  const str = value.toString();

  if (str.length === 3) {
    return '0' + str;
  }

  return str;
}

fields(sticker: StickerPrint): StickerPrintFieldSetting[] {
  return sticker.stickerSetting?.fieldSettings?.length
    ? sticker.stickerSetting.fieldSettings
    : this.defaultFields(sticker);
}

fieldValue(sticker: StickerPrint, key: string): string {
  switch (key) {
    case 'supplierCode':
      return sticker.supplierCode;
    case 'companyShortName':
      return sticker.stickerSetting?.companyShortName ?? this.printData()?.stickerSetting?.companyShortName ?? 'SSBD';
    case 'wholeSaleRate':
      return sticker.wholeSaleRate;
    case 'productName':
      return sticker.productName;
    case 'printDate':
      return sticker.printDateString;
    case 'retailRate':
      return sticker.retailRate;
    case 'barcodeText':
      return sticker.barcode;
    default:
      return '';
  }
}

fieldStyle(field: StickerPrintFieldSetting): Record<string, string> {
  const width = field.fieldKey === 'companyShortName'
    ? Math.max(field.width, 74)
    : field.fieldKey === 'wholeSaleRate'
    ? Math.max(field.width, 128)
    : field.width;
  const x = field.fieldKey === 'wholeSaleRate'
    ? Math.min(field.x, 300 - width - 10)
    : field.x;

  return {
    left: `${x}px`,
    top: `${field.y}px`,
    width: `${width}px`,
    height: `${field.height}px`,
    fontSize: `${field.fontSize}px`,
    fontWeight: field.fontWeight,
    textAlign: field.textAlign,
    lineHeight: `${field.height}px`
  };
}

private stickerPrintStyles(): string {
  return `
    .sticker-print-item{margin:10px 0}
    .app-sticker{position:relative;width:300px;height:134px;background:#fff;border:1px solid #e0e0e0;border-radius:12px;box-sizing:border-box;color:#000;font-family:Arial,sans-serif;overflow:hidden}
    .sticker-field{position:absolute;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .company-code{color:#000;background:transparent;padding:0}
    .barcode-field{display:flex;align-items:center;justify-content:center;overflow:hidden}
    .slot-hidden{visibility:hidden}
  `;
}

private defaultFields(sticker: StickerPrint): StickerPrintFieldSetting[] {
  const visible = sticker.stickerSetting;
  return [
    this.createField('supplierCode', 'Supplier Code', visible?.showSupplierCode !== false, 10, 8, 82, 24, 20, '800', 'left', 1),
    this.createField('companyShortName', 'Company Short Name', visible?.showCompanyShortName !== false, 113, 8, 74, 22, 20, '800', 'center', 2),
    this.createField('wholeSaleRate', 'Wholesale Rate', visible?.showWholeSaleRate !== false, 162, 8, 128, 24, 20, '800', 'right', 3),
    this.createField('productName', 'Product Name', visible?.showProductName !== false, 42, 32, 216, 24, 18, '800', 'center', 4),
    this.createField('printDate', 'Print Date', visible?.showPrintDate !== false, 51, 59, 80, 18, 14, '400', 'left', 5),
    this.createField('retailRate', 'Retail Rate', visible?.showRetailRate !== false, 195, 59, 62, 18, 14, '400', 'right', 6),
    this.createField('barcode', 'Barcode', visible?.showBarcode !== false, 51, 78, 188, 34, 14, '400', 'center', 7),
    this.createField('barcodeText', 'Barcode Text', visible?.showBarcodeText !== false, 121, 113, 58, 14, 12, '400', 'center', 8)
  ];
}

private createField(fieldKey: string, label: string, isVisible: boolean, x: number, y: number, width: number, height: number, fontSize: number, fontWeight: string, textAlign: string, sortOrder: number): StickerPrintFieldSetting {
  return { fieldKey, label, isVisible, x, y, width, height, fontSize, fontWeight, textAlign, sortOrder };
}
}
