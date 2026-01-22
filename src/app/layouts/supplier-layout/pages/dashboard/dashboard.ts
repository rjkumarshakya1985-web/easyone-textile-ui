
import { Component, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../../core/services/dashboard-service';
import { LoaderService } from '../../../../core/services/loader.service';
import { SupplierDashboardResponse } from '../../../../model/response/dashboard/supplier-dashboard';
import { finalize } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, ButtonModule, TagModule,RouterModule],
templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  data = signal<SupplierDashboardResponse | null>(null);
  date = new Date();
  readyParcels = [
    { no: 9910, date: 'Sep 16, 2025', transport: 'MAA ANNAPURNA TRANSPORT AGENCY PVT. LTD.', qty: 22 },
    { no: 9893, date: 'Sep 15, 2025', transport: 'PATEL FLEET SERVICE PVT. LTD.', qty: 77 },
  ];

  cards = signal([
    { icon: 'pi pi-box', title: 'Active Product',url:'/supplier/products', value: 0, color: '#03A9F4' },
    { icon: 'pi pi-truck', title: 'InTransit Parcel',url:'/supplier/salevouchers', value: 0, color: '#F44336' },
    { icon: 'pi pi-pencil', title: 'Sale Voucher',url:'/supplier/salevouchers', value: 0, color: '#FF9800' }
  ]);

  constructor(private dashboardService:DashboardService,
    private loaderService:LoaderService)
  {
    this.loadDashboard();
  }
  
  loadDashboard(): void {
    this.loaderService.show();

    this.dashboardService
      .getSupplierDashboard()
      .pipe(finalize(() => this.loaderService.hide()))
      .subscribe({
        next: result => {
          this.data.set(result);
      
          this.cards.set([
              { ...this.cards()[0], value: result.productCount },
              { ...this.cards()[1], value: result.inTransitParcelCount },
              { ...this.cards()[2], value: result.saleVoucherCount }
          ]);
          console.log(this.data());
        },
        error: err => console.error('Dashboard load failed', err),
      });
  }
}
