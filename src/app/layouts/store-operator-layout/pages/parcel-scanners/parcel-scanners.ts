import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, AfterViewInit,  ViewChild,  ElementRef, OnDestroy } from '@angular/core';
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
    CommonModule,
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
export class ParcelScanners implements OnInit , AfterViewInit, OnDestroy {
@ViewChild('parcelInput')
  parcelInput!: ElementRef<HTMLInputElement>;
  @ViewChild('scannerVideo')
  scannerVideo?: ElementRef<HTMLVideoElement>;
  parcelEnum:ParcelStatus = ParcelStatus.InTransit;
  parcelNumber = signal<number | null>(null);
  parcels = signal<ParcelView[]>([]);
  selectedParcel = signal<ParcelView[]>([]);
  isLoading = signal(false);
  scannerVisible = signal(false);
  scannerStarting = signal(false);
  scannerError = signal('');
  private scannerStream?: MediaStream;
  private scannerFrameId?: number;
  private scannerHandled = false;

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
                   this.focusParcelInput();
              }
       });

    }
ngAfterViewInit(): void {
  this.focusParcelInput();
}

ngOnDestroy(): void {
  this.stopScanner();
}

private focusParcelInput(): void {
  setTimeout(() => {
    this.parcelInput?.nativeElement.focus();
  }, 0);
}

  async startScanner(): Promise<void> {
    if (this.scannerStarting() || this.scannerVisible()) {
      return;
    }

    this.scannerError.set('');
    this.scannerHandled = false;
    this.scannerVisible.set(true);
    this.scannerStarting.set(true);

    setTimeout(async () => {
      try {
        if (!this.scannerVideo?.nativeElement) {
          throw new Error('Camera preview is not ready.');
        }

        if (!this.canUseNativeBarcodeDetector()) {
          throw new Error('Barcode detector is not supported.');
        }

        await this.startNativeScanner(this.scannerVideo.nativeElement);
      } catch {
        this.scannerError.set('Is browser me camera barcode scanner support nahi ho raha hai. Parcel number manually enter karein.');
        this.stopScanner(false);
      } finally {
        this.scannerStarting.set(false);
      }
    }, 0);
  }

  stopScanner(hide = true): void {
    if (this.scannerFrameId) {
      cancelAnimationFrame(this.scannerFrameId);
      this.scannerFrameId = undefined;
    }

    this.scannerStream?.getTracks().forEach(track => track.stop());
    this.scannerStream = undefined;

    if (this.scannerVideo?.nativeElement?.srcObject) {
      const stream = this.scannerVideo.nativeElement.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      this.scannerVideo.nativeElement.srcObject = null;
    }

    if (hide) {
      this.scannerVisible.set(false);
      this.scannerStarting.set(false);
    }
  }

  private handleScannedBarcode(value: string): void {
    const scannedNumber = Number(value.replace(/\D/g, ''));

    if (!scannedNumber) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Barcode',
        detail: 'Barcode me valid parcel number nahi mila.'
      });
      this.focusParcelInput();
      return;
    }

    this.parcelNumber.set(scannedNumber);
    this.onEnter();
  }

  private canUseNativeBarcodeDetector(): boolean {
    return typeof window !== 'undefined' && 'BarcodeDetector' in window;
  }

  private async startNativeScanner(video: HTMLVideoElement): Promise<void> {
    const barcodeWindow = window as unknown as {
      BarcodeDetector: new (options: { formats: string[] }) => {
        detect(source: HTMLVideoElement): Promise<Array<{ rawValue: string }>>;
      };
    };

    const detector = new barcodeWindow.BarcodeDetector({
      formats: ['code_128', 'code_39', 'code_93', 'itf', 'codabar', 'ean_13', 'ean_8', 'upc_a', 'upc_e']
    });

    this.scannerStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    });

    video.srcObject = this.scannerStream;
    await video.play();

    const scan = async () => {
      if (!this.scannerVisible() || this.scannerHandled) {
        return;
      }

      try {
        const results = await detector.detect(video);
        const value = results[0]?.rawValue;
        if (value) {
          this.scannerHandled = true;
          this.stopScanner();
          this.handleScannedBarcode(value);
          return;
        }
      } catch {
        // Keep scanning; camera frames can fail briefly while focusing.
      }

      this.scannerFrameId = requestAnimationFrame(scan);
    };

    this.scannerFrameId = requestAnimationFrame(scan);
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
