
import { Component, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService} from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { LoaderService } from '../../../../../core/services/loader.service';
import { SaleVoucherService } from '../../../../../core/services/salevoucher.service';
import { SaleVoucherResponse } from '../../../../../model/response/salevouchers/salevoucher-response.model';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { SaleVoucherStatusView } from '../../../../../model/response/salevouchers/salevoucher-status-response.model';
import { Helper } from '../../../../../core/helpers/helper';
import { TagModule } from 'primeng/tag';


@Component({
  selector: 'supplier-salevoucher-detail',
  standalone: true,
  providers: [ConfirmationService],
  imports: [ButtonModule, StepperModule,
   CommonModule,TableModule,TabsModule,TagModule    
  ],
 templateUrl: './supplier-salevoucher-detail.html',
  styleUrl: './supplier-salevoucher-detail.css',
})
export class SupplierSalevoucherDetail {
    value:number = 0;
    stepValue = 1;
    saleVoucher = signal<SaleVoucherResponse | null>(null);
    saleVoucherStatus = signal<SaleVoucherStatusView[]>([]);
    saleVoucherId!:number;
    ParcelStatusHelper = Helper;
    statuses = [
    { label: 'InTransit', value: 3 },
  ];
    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private confirmationService: ConfirmationService,
      private loader: LoaderService,
      private saleVoucherService: SaleVoucherService,
    ) {}

    ngOnInit(): void {
      this.loadSaleVoucher();
    }

   loadSaleVoucher() {
      const idParam = this.route.snapshot.paramMap.get('id');
  
      if (idParam) {
         this.saleVoucherId = Number(idParam); // convert string → number
         this.loadSaleVoucherForEdit();
         this.loadSaleVoucherStatus();
        }
    }
  
    loadSaleVoucherForEdit() {
           
         if (!this.saleVoucherId) {
           return;
         }

         this.loader.show();

         this.saleVoucherService.get(this.saleVoucherId)
               .pipe(finalize(() => this.loader.hide()))
               .subscribe({
                  next: (saleVoucher) => {
                  this.saleVoucher.set(saleVoucher);
                 },
                 error: (err) => {
                     console.error('Error loading sale voucher', err);
                     this.router.navigate(['/admin/not-found']);
                }
            });
   
    }
      
    loadSaleVoucherStatus()
    {
      this.saleVoucherService.getAllSaleVoucherStatus(this.saleVoucherId)
               .pipe(finalize(() => this.loader.hide()))
               .subscribe({
                  next: (status) => {
                  this.saleVoucherStatus.set(status);
                 },
                 error: (err) => {
                     console.error('Error loading sale voucher', err);
                     this.router.navigate(['/admin/not-found']);
                }
            });
    }
    getStatusBadgeClass(status: number): string {
  switch (status) {
    case 1: return 'bg-blue-100 text-blue-700';
    case 2: return 'bg-purple-100 text-purple-700';
    case 3: return 'bg-yellow-100 text-yellow-700';
    case 4: return 'bg-indigo-100 text-indigo-700';
    case 5: return 'bg-green-100 text-green-700';
    case 6: return 'bg-orange-100 text-orange-700';
    case 7: return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

}