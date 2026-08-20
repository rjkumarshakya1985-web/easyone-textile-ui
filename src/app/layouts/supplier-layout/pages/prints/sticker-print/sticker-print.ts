import { Component, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { PrintService } from '../../../../../core/services/print-service';
import { ActivatedRoute, Router } from '@angular/router';
import { StickerPrint, StickerPrintFieldSetting } from '../../../../../model/response/print/salevoucher-response-print';
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
  private readonly baseWidth = 300;
  private readonly baseHeight = 134;
  private readonly defaultWidthMm = 70;
  private readonly defaultHeightMm = 30;

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

    const isSaleVoucher =
    this.route.snapshot.queryParamMap.get('isSaleVoucher') === 'true';
   
    if (idParam) {
      let id = idParam;
  
      this.printService.productBarcodeSticker(id,isSaleVoucher)
        .subscribe(result => {
          this.printData.set(result);  
          
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
        <style>${this.stickerPrintStyles()}</style>
      </head>
      <body onload="window.print();window.close()">
        ${printContents}
      </body>
    </html>`
  );
  popupWin!.document.close();
  }

  back()
  {
   window.history.back();
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
        return sticker.stickerSetting?.companyShortName ?? 'SSBD';
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

  stickerStyle(sticker: StickerPrint): Record<string, string> {
    if (!this.hasCustomStickerSize(sticker)) {
      return {};
    }

    return {
      width: `${sticker.stickerSetting?.stickerWidthMm}mm`,
      height: `${sticker.stickerSetting?.stickerHeightMm}mm`
    };
  }

  fieldStyle(field: StickerPrintFieldSetting, sticker?: StickerPrint): Record<string, string> {
    const width = field.fieldKey === 'companyShortName'
      ? Math.max(field.width, 74)
      : field.fieldKey === 'wholeSaleRate'
      ? Math.max(field.width, 128)
      : field.width;
    const x = field.fieldKey === 'wholeSaleRate'
      ? Math.min(field.x, this.baseWidth - width - 10)
      : field.x;

    if (sticker && this.hasCustomStickerSize(sticker)) {
      const fontScale = Math.min(
        Number(sticker.stickerSetting?.stickerWidthMm) / this.defaultWidthMm,
        Number(sticker.stickerSetting?.stickerHeightMm) / this.defaultHeightMm
      );

      return {
        left: `${(x / this.baseWidth) * 100}%`,
        top: `${(field.y / this.baseHeight) * 100}%`,
        width: `${(width / this.baseWidth) * 100}%`,
        height: `${(field.height / this.baseHeight) * 100}%`,
        fontSize: `${Math.max(7, field.fontSize * fontScale)}px`,
        fontWeight: field.fontWeight,
        textAlign: field.textAlign,
        lineHeight: `${Math.max(10, field.height * fontScale)}px`
      };
    }

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

  private hasCustomStickerSize(sticker: StickerPrint): boolean {
    return sticker.stickerSetting?.hasCustomSize === true &&
      !!sticker.stickerSetting?.stickerWidthMm &&
      !!sticker.stickerSetting?.stickerHeightMm;
  }

  private stickerPrintStyles(): string {
    return `
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
