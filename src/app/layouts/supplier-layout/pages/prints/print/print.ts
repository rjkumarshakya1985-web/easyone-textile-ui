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
  private readonly baseWidth = 300;
  private readonly baseHeight = 134;
  private readonly defaultWidthMm = 70;
  private readonly defaultHeightMm = 30;
  
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
    const element = document.getElementById(id);

  if (!element) {
    return;
  }

  const printContents = element.innerHTML;

  const width = Math.floor(window.screen.availWidth * 0.95);
  const height = Math.floor(window.screen.availHeight * 0.95);

  const left = Math.floor((window.screen.availWidth - width) / 2);
  const top = Math.floor((window.screen.availHeight - height) / 2);

  const popupWin = window.open(
    '',
    '_blank',
    `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
  );

  if (!popupWin) {
    return;
  }

   popupWin!.document.open();
  popupWin!.document.write(`
    <html>
      <head>
        <title>Print</title>
        <link rel="stylesheet"
         href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">
        <style> ${this.printCommonStyles()}

          ${this.stickerPrintStyles()}

          ${this.parcelPrintStyles()}</style>
      </head>
      <body>
       <div class="print-container">
          ${printContents}
        </div> 
        <script>

          window.onload = function () {

            setTimeout(function () {

              window.focus();

              window.print();

              window.close();

            }, 500);

          };

        </script>      
      </body>
    </html>`
  );
  popupWin!.document.close();
  }
  private printCommonStyles(): string {

  return `
    * {
      box-sizing: border-box;
    }

    html,
    body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #000000;
      font-family: Arial, Helvetica, sans-serif;
    }

    .print-container {
      width: 100%;
      margin: 0;
      padding: 0;
    }

    @media print {

      html,
      body {
        width: 100%;
        margin: 0 !important;
        padding: 0 !important;
      }

      .no-print {
        display: none !important;
      }
    }
  `;
}
private parcelPrintStyles(): string {

  return `

    /* ==========================================
       PARCEL PRINT AREA
    ========================================== */

    .parcel-print-area {
      display: block;
      width: 100%;
      margin: 0 auto;
      padding: 10px;
      box-sizing: border-box;
    }


    /* ==========================================
       OUTER STICKER
    ========================================== */

    .parcel-sticker {

      width: 100%;
      max-width: 900px;

      margin: 0 auto;

      background: #ffffff;
      color: #000000;

      border: 3px solid #000000;

      font-family: Arial, Helvetica, sans-serif;

      overflow: hidden;

      box-sizing: border-box;
    }


    /* ==========================================
       COMPANY HEADER
    ========================================== */

    .parcel-header {

      width: 100%;

      text-align: center;

      padding: 12px 15px 10px;

      border-bottom: 2px solid #000000;

      box-sizing: border-box;
    }


    .parcel-company-name {

      margin: 0;

      font-size: 32px;

      line-height: 1.1;

      font-weight: 900;

      text-transform: uppercase;

      letter-spacing: 0.5px;
    }


    .parcel-company-address {

      margin-top: 5px;

      font-size: 14px;

      line-height: 1.3;

      font-weight: 500;
    }


    .parcel-contact-row {

      margin-top: 6px;

      font-size: 13px;

      font-weight: 600;

      text-align: center;
    }


    .parcel-contact-row span {

      display: inline-block;

      margin: 0 15px;
    }


    /* ==========================================
       TITLE BAR
    ========================================== */

    

    .parcel-title-bar {
  background-color: #000000 !important;
  color: #ffffff !important;

  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  color-adjust: exact !important;
}

.parcel-title,
.parcel-date {
  color: #ffffff !important;
  background-color: #000000 !important;

  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  color-adjust: exact !important;
}

.parcel-title {
  font-size: 14px !important;
  padding: 6px 8px !important;
  font-weight: 900 !important;
}

.parcel-date {
  font-size: 10px !important;
  padding: 6px 8px !important;
  font-weight: 600 !important;
}


    /* ==========================================
       BODY
    ========================================== */

    .parcel-body {

      display: table;

      table-layout: fixed;

      width: 100%;

      border-collapse: collapse;
    }


    /* ==========================================
       LEFT SIDE
    ========================================== */

    .parcel-details {

      display: table-cell;

      width: 62%;

      vertical-align: top;

      border-right: 2px solid #000000;
    }


    /* ==========================================
       DETAIL ROW
    ========================================== */

    .parcel-detail-row {

      display: table;

      table-layout: fixed;

      width: 100%;

      border-bottom: 1px solid #777777;

      border-collapse: collapse;
    }


    .parcel-detail-row:last-child {

      border-bottom: none;
    }


    /* ==========================================
       LABEL
    ========================================== */

    .parcel-label {

      display: table-cell;

      width: 145px;

      padding: 8px 8px;

      vertical-align: middle;

      background: #eeeeee;

      border-right: 1px solid #777777;

      font-size: 11px;

      font-weight: 800;

      white-space: nowrap;
    }


    /* ==========================================
       VALUE
    ========================================== */

    .parcel-value {

      display: table-cell;

      padding: 8px 10px;

      vertical-align: middle;

      font-size: 16px;

      line-height: 1.25;

      font-weight: 800;

      white-space: normal;

      word-break: break-word;

      overflow-wrap: anywhere;
    }


    /* ==========================================
       DISPATCH NUMBER
    ========================================== */

    .dispatch-number {

      font-size: 25px;

      font-weight: 900;

      letter-spacing: 1px;
    }


    .highlight-row .parcel-label {

      background: #dddddd;
    }


    /* ==========================================
       TRANSPORT
    ========================================== */

    .transport-name {

      font-size: 16px;

      text-transform: uppercase;
    }


    /* ==========================================
       PARTICULARS
    ========================================== */

    .particulars-row .parcel-value {

      font-size: 14px;

      line-height: 1.3;
    }


    /* ==========================================
       BARCODE SECTION
    ========================================== */

    .parcel-barcode-section {

      display: table-cell;

      width: 38%;

      vertical-align: middle;

      text-align: center;

      padding: 12px;

      box-sizing: border-box;
    }


    .barcode-heading {

      padding-bottom: 5px;

      margin-bottom: 8px;

      border-bottom: 1px solid #bbbbbb;

      font-size: 11px;

      font-weight: 800;

      letter-spacing: 1px;
    }


    .parcel-barcode {

      width: 100%;

      margin: 5px auto;

      text-align: center;

      overflow: hidden;
    }


    /*
       ngx-barcode6 normally generates SVG.
       This prevents it from overflowing.
    */

    .parcel-barcode svg {

      display: block;

      max-width: 100% !important;

      height: auto !important;

      margin: 0 auto;
    }


    .parcel-barcode canvas {

      max-width: 100% !important;

      height: auto !important;
    }


    .barcode-number {

      margin-top: 5px;

      font-size: 12px;

      font-weight: 800;
    }


    /* ==========================================
       FOOTER
    ========================================== */

    .parcel-footer {

      display: table;

      table-layout: fixed;

      width: 100%;

      border-top: 2px solid #000000;
    }


    .parcel-footer-message {

      display: table-cell;

      width: 70%;

      padding: 7px 10px;

      vertical-align: middle;

      font-size: 10px;

      font-weight: 800;
    }


    .parcel-footer-company {

      display: table-cell;

      width: 30%;

      padding: 7px 10px;

      vertical-align: middle;

      text-align: right;

      font-size: 10px;

      font-weight: 700;
    }


    /* ==========================================
       PRINT
    ========================================== */

    @media print {

      @page {

        size: A4 portrait;

        margin: 8mm;
      }


      html,
      body {

        margin: 0 !important;

        padding: 0 !important;

        width: 100% !important;

        background: #ffffff !important;
      }


      .print-container {

        margin: 0 !important;

        padding: 0 !important;

        width: 100% !important;
      }


      .parcel-print-area {

        margin: 0 !important;

        padding: 0 !important;

        width: 100% !important;
      }


      .parcel-sticker {

        width: 100% !important;

        max-width: none !important;

        margin: 0 !important;

        border: 2px solid #000000 !important;

        border-radius: 0 !important;

        box-shadow: none !important;

        page-break-inside: avoid !important;

        break-inside: avoid !important;

        overflow: hidden !important;
      }


      .parcel-header {

        padding: 8px 10px !important;
      }


      .parcel-company-name {

        font-size: 26px !important;
      }


      .parcel-company-address {

        font-size: 11px !important;
      }


      .parcel-contact-row {

        font-size: 11px !important;
      }


      .parcel-title-bar {

        background: #000000 !important;

        color: #ffffff !important;

        -webkit-print-color-adjust: exact !important;

        print-color-adjust: exact !important;
      }


      .parcel-title {

        font-size: 14px !important;

        padding: 6px 8px !important;
      }


      .parcel-date {

        font-size: 10px !important;

        padding: 6px 8px !important;
      }


      .parcel-label {

        width: 125px !important;

        padding: 6px !important;

        font-size: 9px !important;

        background: #eeeeee !important;

        -webkit-print-color-adjust: exact !important;

        print-color-adjust: exact !important;
      }


      .highlight-row .parcel-label {

        background: #dddddd !important;

        -webkit-print-color-adjust: exact !important;

        print-color-adjust: exact !important;
      }


      .parcel-value {

        padding: 6px 8px !important;

        font-size: 13px !important;
      }


      .dispatch-number {

        font-size: 21px !important;
      }


      .particulars-row .parcel-value {

        font-size: 12px !important;
      }


      .parcel-barcode-section {

        padding: 8px !important;
      }


      .barcode-heading {

        font-size: 9px !important;
      }


      .barcode-number {

        font-size: 10px !important;
      }


      .parcel-footer-message,
      .parcel-footer-company {

        padding: 5px 7px !important;

        font-size: 8px !important;
      }
    }
  `;
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
    .sticker-print-item{margin:0}
    .app-sticker{position:relative;width:300px;height:134px;background:#fff;border:1px solid #e0e0e0;border-radius:12px;box-sizing:border-box;color:#000;font-family:Arial,sans-serif;overflow:hidden}
    .sticker-field{position:absolute;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .company-code{color:#000;background:transparent;padding:0}
    .barcode-field{display:flex;align-items:center;justify-content:center;overflow:hidden}
    .slot-hidden{visibility:hidden}
    .sale-voucher-table .rate-column{width:140px;min-width:140px;text-align:right;white-space:nowrap;vertical-align:middle}
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
