import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { NgxBarcode6Module } from 'ngx-barcode6';
import { PrintService } from '../../../../core/services/print-service';
import {
  StickerPrint,
  StickerPrintFieldSetting,
  StickerPrintSetting,
  SupplierStickerSizeSetting
} from '../../../../model/response/print/salevoucher-response-print';

@Component({
  selector: 'app-sticker-size-setting',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToolbarModule,
    BreadcrumbModule,
    ButtonModule,
    CardModule,
    NgxBarcode6Module
  ],
  templateUrl: './sticker-size-setting.html',
  styleUrl: './sticker-size-setting.css'
})
export class StickerSizeSetting {
  private readonly baseWidth = 300;
  private readonly baseHeight = 134;
  private readonly defaultWidthMm = 70;
  private readonly defaultHeightMm = 30;

  widthMm = signal<number>(this.defaultWidthMm);
  heightMm = signal<number>(this.defaultHeightMm);
  isSaving = signal(false);
  stickerSetting = signal<StickerPrintSetting | null>(null);

  breadcrumbItems: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/supplier/dashboard' },
    { label: 'Sticker Size' }
  ];

  demoSticker: StickerPrint = {
    barcode: '000009',
    retailRate: '81206',
    purchaseRate: 0,
    wholeSaleRate: '5605',
    mrpRate: '0',
    supplierCode: 'S0001',
    name: 'Deepa 1',
    productName: 'DEEPA 1',
    printDateString: '09082026'
  };

  constructor(
    private printService: PrintService,
    private messageService: MessageService
  ) {
    this.load();
  }

  load(): void {
    this.printService.getSupplierStickerDemoSetting().subscribe(setting => {
      this.stickerSetting.set(setting);
      this.demoSticker = {
        ...this.demoSticker,
        stickerSetting: setting
      };
    });

    this.printService.getSupplierStickerSizeSetting().subscribe(setting => {
      if (setting.hasCustomSize && setting.stickerWidthMm && setting.stickerHeightMm) {
        this.widthMm.set(setting.stickerWidthMm);
        this.heightMm.set(setting.stickerHeightMm);
      }
    });
  }

  save(): void {
    if (this.widthMm() <= 0 || this.heightMm() <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid size',
        detail: 'Sticker width and height must be greater than zero.'
      });
      return;
    }

    const request: SupplierStickerSizeSetting = {
      stickerWidthMm: this.widthMm(),
      stickerHeightMm: this.heightMm(),
      hasCustomSize: true
    };

    this.isSaving.set(true);
    this.printService.saveSupplierStickerSizeSetting(request).subscribe({
      next: () => {
        const current = this.stickerSetting();
        if (current) {
          const updated = {
            ...current,
            stickerWidthMm: this.widthMm(),
            stickerHeightMm: this.heightMm(),
            hasCustomSize: true
          };
          this.stickerSetting.set(updated);
          this.demoSticker = {
            ...this.demoSticker,
            stickerSetting: updated
          };
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Saved',
          detail: 'Sticker size saved successfully.'
        });
        this.isSaving.set(false);
      },
      error: () => this.isSaving.set(false)
    });
  }

  printDemo(): void {
    const printContents = document.getElementById('supplier-sticker-demo-print')?.innerHTML;
    if (!printContents) {
      return;
    }

    const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin!.document.open();
    popupWin!.document.write(`
      <html>
        <head>
          <title>Print Demo Sticker</title>
          <style>${this.printStyles()}</style>
        </head>
        <body onload="window.print();window.close()">
          ${printContents}
        </body>
      </html>`
    );
    popupWin!.document.close();
  }

  updateWidth(value: string): void {
    this.widthMm.set(Number(value) || this.defaultWidthMm);
  }

  updateHeight(value: string): void {
    this.heightMm.set(Number(value) || this.defaultHeightMm);
  }

fields(sticker: StickerPrint): StickerPrintFieldSetting[] {
  const setting = sticker.stickerSetting;
 if (!setting?.fieldSettings?.length) {
    return [];
  }

  // Admin fieldSettings is the source of truth.
  if (setting.fieldSettings?.length) {
    return setting.fieldSettings
      .filter(field => field.isVisible)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  // Backward compatibility for old records
   return setting.fieldSettings
    .filter(field => field.isVisible)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

  fieldValue(sticker: StickerPrint, key: string): string {
    switch (key) {
      case 'supplierCode':
        return sticker.supplierCode;
      case 'companyShortName':
        return sticker.stickerSetting?.companyShortName ?? 'DEMO';
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

  stickerStyle(): Record<string, string> {
    return {
      width: `${this.widthMm()}mm`,
      height: `${this.heightMm()}mm`
    };
  }

  fieldStyle(field: StickerPrintFieldSetting): Record<string, string> {
    const width = field.fieldKey === 'companyShortName'
      ? Math.max(field.width, 74)
      : field.fieldKey === 'wholeSaleRate'
      ? Math.max(field.width, 128)
      : field.width;
    const x = field.fieldKey === 'wholeSaleRate'
      ? Math.min(field.x, this.baseWidth - width - 10)
      : field.x;
    const fontScale = Math.min(this.widthMm() / this.defaultWidthMm, this.heightMm() / this.defaultHeightMm);

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

  private printStyles(): string {
    return `
      body{margin:0;padding:0;background:#fff}
      .app-sticker{position:relative;background:#fff;border:1px solid #e0e0e0;border-radius:12px;box-sizing:border-box;color:#000;font-family:Arial,sans-serif;overflow:hidden}
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
