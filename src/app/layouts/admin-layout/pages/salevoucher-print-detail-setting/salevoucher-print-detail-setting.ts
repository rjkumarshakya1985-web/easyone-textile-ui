import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { TextareaModule } from 'primeng/textarea';
import { LoaderService } from '../../../../core/services/loader.service';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { PrintService } from '../../../../core/services/print-service';
import { SaleVoucherPrintDetailSetting } from '../../../../model/response/print/salevoucher-response-print';

@Component({
  selector: 'app-salevoucher-print-detail-setting',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToolbarModule,
    BreadcrumbModule,
    CardModule,
    InputTextModule,
    TextareaModule,
    ButtonModule
  ],
  templateUrl: './salevoucher-print-detail-setting.html',
  styleUrl: './salevoucher-print-detail-setting.css'
})
export class SaleVoucherPrintDetailSettingPage implements OnInit {
  detail = signal<SaleVoucherPrintDetailSetting>(this.defaultDetail());

  breadcrumbItems: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/admin/dashboard' },
    { label: 'Sale Voucher Print Details' }
  ];

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

    this.printService.getSaleVoucherPrintDetail().subscribe({
      next: (detail) => this.detail.set({ ...this.defaultDetail(), ...detail }),
      error: () => {
        this.detail.set(this.defaultDetail());
        this.messageService.add({
          severity: 'warn',
          summary: 'Print Details',
          detail: 'Default print detail loaded.'
        });
      },
      complete: () => this.loader.hide()
    });
  }

  save(): void {
    const current = this.detail();

    if (!current.companyName?.trim() || !current.address1?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Required',
        detail: 'Company name and address line 1 required hai.'
      });
      return;
    }

    this.loader.show();

    this.printService.saveSaleVoucherPrintDetail(current).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Saved',
          detail: 'Sale voucher print details updated successfully.'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Print details save nahi hua.'
        });
      },
      complete: () => this.loader.hide()
    });
  }

  update(patch: Partial<SaleVoucherPrintDetailSetting>): void {
    this.detail.set({
      ...this.detail(),
      ...patch
    });
  }

  private defaultDetail(): SaleVoucherPrintDetailSetting {
    return {
      id: 0,
      companyName: '',
      address1: '',
      address2: '',
      description: '',
      gstIn: ''
    };
  }
}
