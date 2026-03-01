import { Component, OnInit, signal } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ParcelService } from '../../../../core/services/parcel-service';
import { ParcelView } from '../../../../model/views/parcel-view.model';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { ParcelStatus } from '../../../../core/enums/enum';

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
export class ParcelScanners implements OnInit {

  parcelEnum:ParcelStatus = ParcelStatus.InTransit;
  parcelNumber = signal<number | null>(null);
  parcels = signal<ParcelView[]>([]);
  selectedParcel = signal<ParcelView[]>([]);
  isLoading = signal(false);

  breadcrumbItems: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/supplier' },
    { label: 'Parcel Scan' }
  ];

  constructor(private parcelService: ParcelService,
    private messageService: MessageService, private router: Router,
    private route: ActivatedRoute) {}

    ngOnInit(): void {  
      
      this.route.params.subscribe(params => {
            const status = params['status'];
              if (status) {
                 this.parcelEnum = +status as ParcelStatus;
                 this.parcels.set([])
                 this.selectedParcel.set([]);
              }
       });

    }

    onEnter() {
      const scannedNumber = this.parcelNumber();
      if (!scannedNumber || this.isLoading()) return;

      this.isLoading.set(true);

     this.parcelService.getParcelScanInfo(scannedNumber, this.parcelEnum)
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
    statusEnum: this.parcelEnum==ParcelStatus.InTransit
                 ? ParcelStatus.Transport
                 : this.parcelEnum === ParcelStatus.Transport
                 ? ParcelStatus.PackedAtLocation
                 : ParcelStatus.Opened
   };

  this.isLoading.set(true);

  let apiCall$;

  if (this.parcelEnum === ParcelStatus.InTransit  || this.parcelEnum===ParcelStatus.Transport) {
    apiCall$ = this.parcelService.changeParcelStatus(request);
  }
  else if (this.parcelEnum === ParcelStatus.PackedAtLocation) {
    apiCall$ = this.parcelService.moveSaleVoucherProductsToStock(request);
  }
  else {
    this.isLoading.set(false);
    return;
  }

  apiCall$.subscribe({
    next: (success) => {
      if (success) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.parcelEnum === ParcelStatus.InTransit
            ? 'Parcels moved to warehouse successfully.'
            : 'Stock updated successfully.'
        });

        this.parcels.set([]);
        this.selectedParcel.set([]);
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Failed',
          detail: 'Operation failed.'
        });
      }
    },
    error: () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Server error while processing request.'
      });
    },
    complete: () => {
      this.isLoading.set(false);
    }
  });
}
  
  get actionButtonLabel(): string {
 
    switch (this.parcelEnum) {
    case ParcelStatus.InTransit:
      return 'Receive in Transport';
    case ParcelStatus.Transport:
      return 'Packed at Location';
    case ParcelStatus.PackedAtLocation:
      return 'Open Parcel';
    default:
      return 'Update Status';
  }
  }

  get helpTooltip(): string {
 
    switch (this.parcelEnum) {
       case ParcelStatus.InTransit:
           return `
            1. Scan or enter the parcel number.
            2. Parcel details will appear in the list.
            3. Duplicate parcels will not be added.
            4. Review the list and click 'Receive in Warehouse'.
            5. Parcel status will be updated to Warehouse Received.
            `;
         case ParcelStatus.Transport:
           return `
            1. Scan or enter the parcel number.
            2. Parcel details will appear in the list.
            3. Duplicate parcels will not be added.
            4. Review the list and click 'Packed at Location'.
            5. Parcel status will be updated to Packed at Location Received.
            `;
        case ParcelStatus.PackedAtLocation:
          return `
            1. Scan parcel received in warehouse.
            2. Verify supplier and product details.
            3. Click 'Open Parcel'.
            4. Stock quantity will be updated based on the parcel products.
            5. Parcel status will move to Opened.
            `;
    default:
      return 'Scan parcel to continue.';
  }
}
}
