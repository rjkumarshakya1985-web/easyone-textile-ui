import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { PrintService } from '../../../../core/services/print-service';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { LoaderService } from '../../../../core/services/loader.service';
import { StickerPrintFieldSetting, StickerPrintSetting } from '../../../../model/response/print/salevoucher-response-print';

@Component({
  selector: 'app-sticker-print-setting',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToolbarModule,
    BreadcrumbModule,
    CardModule,
    CheckboxModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './sticker-print-setting.html',
  styleUrl: './sticker-print-setting.css'
})
export class StickerPrintSettingPage implements OnInit {
  setting = signal<StickerPrintSetting | null>(null);
  activeDrag: { key: string; offsetX: number; offsetY: number } | null = null;

  breadcrumbItems: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/admin/dashboard' },
    { label: 'Sticker Settings' }
  ];

  readonly fieldOptions = [
    { key: 'supplierCode', legacyKey: 'showSupplierCode', label: 'Supplier Code' },
    { key: 'companyShortName', legacyKey: 'showCompanyShortName', label: 'Company Short Name' },
    { key: 'wholeSaleRate', legacyKey: 'showWholeSaleRate', label: 'Wholesale Rate' },
    { key: 'productName', legacyKey: 'showProductName', label: 'Product Name' },
    { key: 'printDate', legacyKey: 'showPrintDate', label: 'Print Date' },
    { key: 'retailRate', legacyKey: 'showRetailRate', label: 'Retail Rate' },
    { key: 'barcode', legacyKey: 'showBarcode', label: 'Barcode' },
    { key: 'barcodeText', legacyKey: 'showBarcodeText', label: 'Barcode Text' }
  ] as const;

  constructor(
    private printService: PrintService,
    private storage: LocalStorageService,
    private router: Router,
    private loader: LoaderService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const user = this.storage.getUser();

    if (!user?.isDeveloper || user.roleName !== 'SuperAdmin') {
      this.router.navigate(['/admin/dashboard']);
      return;
    }

    this.load();
  }

  load(): void {
    this.loader.show();

    this.printService.getStickerSetting().subscribe({
      next: (setting) => this.setting.set(this.withDefaultFields(setting)),
      error: () => {
        this.setting.set(this.defaultSetting());
        this.messageService.add({
          severity: 'warn',
          summary: 'Sticker Settings',
          detail: 'Default setting loaded.'
        });
      },
      complete: () => this.loader.hide()
    });
  }

  save(): void {
    const current = this.setting();
    if (!current) {
      return;
    }

    this.loader.show();

    this.printService.saveStickerSetting(current).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Saved',
          detail: 'Sticker settings updated successfully.'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Sticker settings save nahi hua.'
        });
      },
      complete: () => this.loader.hide()
    });
  }

  toggleField(fieldKey: string, legacyKey: keyof StickerPrintSetting, value: boolean): void {
    const current = this.setting();
    if (!current) {
      return;
    }

    this.setting.set({
      ...current,
      [legacyKey]: value,
      fieldSettings: current.fieldSettings.map(field =>
        field.fieldKey === fieldKey ? { ...field, isVisible: value } : field
      )
    });
  }

  updateSetting(patch: Partial<StickerPrintSetting>): void {
    const current = this.setting();
    if (!current) {
      return;
    }

    this.setting.set({
      ...current,
      ...patch
    });
  }

  previewWholeSaleRate(): string {
    const current = this.setting();
    if (!current) {
      return '5605';
    }

    const baseRate = current.applyWholeSaleRateFormula
      ? 5105 + Number(current.wholeSaleRateAddAmount || 0)
      : 5105;

    return `${current.wholeSaleRatePrefix || ''}${baseRate}${current.wholeSaleRatePostfix || ''}`;
  }

  fieldByKey(key: string): StickerPrintFieldSetting | undefined {
    return this.setting()?.fieldSettings.find(field => field.fieldKey === key);
  }

  fieldValue(key: string): string {
    const current = this.setting();
    switch (key) {
      case 'supplierCode':
        return 'S0001';
      case 'companyShortName':
        return current?.companyShortName ?? 'SSBD';
      case 'wholeSaleRate':
        return this.previewWholeSaleRate();
      case 'productName':
        return 'DEEPA 1';
      case 'printDate':
        return '09082026';
      case 'retailRate':
        return '81206';
      case 'barcodeText':
        return '000009';
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

  startDrag(event: MouseEvent, field: StickerPrintFieldSetting): void {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    const sticker = target.closest('.app-sticker') as HTMLElement | null;
    if (!sticker) {
      return;
    }

    const stickerRect = sticker.getBoundingClientRect();
    this.activeDrag = {
      key: field.fieldKey,
      offsetX: event.clientX - stickerRect.left - field.x,
      offsetY: event.clientY - stickerRect.top - field.y
    };
  }

  onPreviewMove(event: MouseEvent): void {
    const drag = this.activeDrag;
    const current = this.setting();
    if (!drag || !current) {
      return;
    }

    const sticker = event.currentTarget as HTMLElement;
    const rect = sticker.getBoundingClientRect();

    this.setting.set({
      ...current,
      fieldSettings: current.fieldSettings.map(field => {
        if (field.fieldKey !== drag.key) {
          return field;
        }

        const maxX = 300 - field.width;
        const maxY = 134 - field.height;
        return {
          ...field,
          x: this.clamp(event.clientX - rect.left - drag.offsetX, 0, maxX),
          y: this.clamp(event.clientY - rect.top - drag.offsetY, 0, maxY)
        };
      })
    });
  }

  stopDrag(): void {
    this.activeDrag = null;
  }

  updateField(fieldKey: string, patch: Partial<StickerPrintFieldSetting>): void {
    const current = this.setting();
    if (!current) {
      return;
    }

    this.setting.set({
      ...current,
      fieldSettings: current.fieldSettings.map(field =>
        field.fieldKey === fieldKey ? { ...field, ...patch } : field
      )
    });
  }

  private withDefaultFields(setting: StickerPrintSetting): StickerPrintSetting {
    const defaults = this.defaultFields();
    const existing = setting.fieldSettings?.length ? setting.fieldSettings : [];
    const fieldSettings = defaults.map(field => ({
      ...field,
      ...existing.find(item => item.fieldKey === field.fieldKey)
    }));

    return {
      ...setting,
      fieldSettings
    };
  }

  private defaultSetting(): StickerPrintSetting {
    return {
      showSupplierCode: true,
      showCompanyShortName: true,
      showWholeSaleRate: true,
      showProductName: true,
      showPrintDate: true,
      showRetailRate: true,
      showBarcode: true,
      showBarcodeText: true,
      companyShortName: 'SSBD',
      applyWholeSaleRateFormula: true,
      wholeSaleRatePrefix: '5',
      wholeSaleRatePostfix: null,
      wholeSaleRateAddAmount: 500,
      fieldSettings: this.defaultFields()
    };
  }

  private defaultFields(): StickerPrintFieldSetting[] {
    return [
      this.createField('supplierCode', 'Supplier Code', true, 10, 8, 82, 24, 20, '800', 'left', 1),
      this.createField('companyShortName', 'Company Short Name', true, 113, 8, 74, 22, 20, '800', 'center', 2),
      this.createField('wholeSaleRate', 'Wholesale Rate', true, 162, 8, 128, 24, 20, '800', 'right', 3),
      this.createField('productName', 'Product Name', true, 42, 32, 216, 24, 18, '800', 'center', 4),
      this.createField('printDate', 'Print Date', true, 51, 59, 80, 18, 14, '400', 'left', 5),
      this.createField('retailRate', 'Retail Rate', true, 195, 59, 62, 18, 14, '400', 'right', 6),
      this.createField('barcode', 'Barcode', true, 51, 78, 188, 34, 14, '400', 'center', 7),
      this.createField('barcodeText', 'Barcode Text', true, 121, 113, 58, 14, 12, '400', 'center', 8)
    ];
  }

  private createField(
    fieldKey: string,
    label: string,
    isVisible: boolean,
    x: number,
    y: number,
    width: number,
    height: number,
    fontSize: number,
    fontWeight: string,
    textAlign: string,
    sortOrder: number
  ): StickerPrintFieldSetting {
    return { fieldKey, label, isVisible, x, y, width, height, fontSize, fontWeight, textAlign, sortOrder };
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(Math.round(value), min), max);
  }
}
