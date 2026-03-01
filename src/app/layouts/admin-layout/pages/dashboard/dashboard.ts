
import { Component, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { AdminDashboardResponse } from '../../../../model/response/dashboard/admin-dashboard';
import { DashboardService } from '../../../../core/services/dashboard-service';
import { LoaderService } from '../../../../core/services/loader.service';
import { finalize } from 'rxjs';
import { RouterModule } from '@angular/router';
import { TurnoverChart } from '../charts/turnover-chart/turnover-chart';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule,
     ButtonModule, TagModule,DividerModule,RouterModule,TurnoverChart],
templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  data = signal<AdminDashboardResponse | null>(null);
  date = new Date();
  
  cards = signal([
    { icon: 'pi pi-box', title: 'Active Supplier',url:'/admin/suppliers', value: 22, color: '#03A9F4' },
    { icon: 'pi pi-truck', title: 'Customer',url:'/admin/customers', value: 2, color: '#F44336' },
    { icon: 'pi pi-pencil', title: 'InTransit Parcel',url:'/admin/customers', value: 0, color: '#FF9800' },
    { icon: 'pi pi-pencil', title: 'Open Parcel',url:'/admin/customers', value: 0, color: '#FF9800' }
  ]);
  constructor(private dashboardService:DashboardService,
      private loaderService:LoaderService)
    {
      this.loadDashboard();
    }

    loadDashboard()
    {
      this.loaderService.show();
      
          this.dashboardService
            .getAdminDashboard()
            .pipe(finalize(() => this.loaderService.hide()))
            .subscribe({
              next: result => {
                this.data.set(result);
            
                this.cards.set([
                    { ...this.cards()[0], value: result.supplierCount },
                    { ...this.cards()[1], value: 0 },
                    { ...this.cards()[2], value: result.inParcel },
                    { ...this.cards()[3], value: result.openParcel }
                ]);
                console.log(this.data());
              },
              error: err => console.error('Dashboard load failed', err),
            });
    }
    
  readyParcels = [
    { no: 9910, date: 'Sep 16, 2025', transport: 'MAA ANNAPURNA TRANSPORT AGENCY PVT. LTD.', qty: 22 },
    { no: 9893, date: 'Sep 15, 2025', transport: 'PATEL FLEET SERVICE PVT. LTD.', qty: 77 },
  ];

 
}
