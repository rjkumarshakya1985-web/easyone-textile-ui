import { Component, signal } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ParcelService } from '../../../../core/services/parcel-service';
import { ParcelView } from '../../../../model/views/parcel-view.model';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-parcel-scanners',
  standalone: true,
  imports: [
    FormsModule,
    TableModule,
    ToolbarModule,
    ButtonModule,
    CheckboxModule,
    TooltipModule
  ],
  templateUrl: './parcel-scanners.html',
  styleUrl: './parcel-scanners.css',
})
export class ParcelScanners {

  // ✅ SINGLE STATE (signals)
  parcelNumber = signal<number | null>(null);
  parcels = signal<ParcelView[]>([]);
  selectedParcel = signal<ParcelView[]>([]);
  isLoading = signal(false);

  breadcrumbItems: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/supplier' },
    { label: 'Parcel Scan' }
  ];

  constructor(private parcelService: ParcelService,private messageService: MessageService) {}

  onEnter() {
  const scannedNumber = this.parcelNumber();
  if (!scannedNumber || this.isLoading()) return;

  this.isLoading.set(true);

  this.parcelService.getParcelScanInfo(scannedNumber, 3)
    .subscribe({
      next: (res) => {

        if (res.isAvailable && res.saleVoucher) {

          const exists = this.parcels()
            .some(p => p.saleVoucherId === res.saleVoucher?.saleVoucherId);

          if (!exists) {
            this.parcels.set([
              ...this.parcels(),
              res.saleVoucher
            ]);

            this.messageService.add({
              severity: 'success',
              summary: 'Scanned',
              detail: 'Parcel scanned successfully'
            });

          } else {
            this.messageService.add({
              severity: 'info',
              summary: 'Already Scanned',
              detail: 'This parcel is already in the list.'
            });
          }

        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Not Available',
            detail: res.message ?? 'Parcel is not available.'
          });
        }

        // reset input
        this.parcelNumber.set(null);
      },

      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to scan parcel. Please try again.'
        });
      },

      complete: () => {
        this.isLoading.set(false);
      }
    });
  }
  
  remove(saleVoucherId: number) {

  const updated = this.parcels()
    .filter(p => p.saleVoucherId !== saleVoucherId);

  if (updated.length === this.parcels().length) {
    return; // nothing removed
  }

  this.parcels.set(updated);

  this.messageService.add({
    severity: 'success',
    summary: 'Removed',
    detail: 'Parcel removed from scan list'
  });
  }
  
  parcelReceived() {

  const parcels = this.parcels();

  if (!parcels || parcels.length === 0) {
    this.messageService.add({
      severity: 'warn',
      summary: 'No Parcels',
      detail: 'Please scan at least one parcel.'
    });
    return;
  }

  const request = {
    saleVoucherId: parcels.map(p => p.saleVoucherId),
    statusEnum: 4 // ParcelStatusEnum.InWarehouse
  };

  this.isLoading.set(true);

  this.parcelService.changeParcelStatus(request)
    .subscribe({
      next: (success) => {
        if (success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Parcels moved to warehouse successfully.'
          });

          // clear table
          this.parcels.set([]);
          this.selectedParcel.set([]);
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Failed',
            detail: 'Parcel status update failed.'
          });
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Server error while updating parcel status.'
        });
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
}

}
