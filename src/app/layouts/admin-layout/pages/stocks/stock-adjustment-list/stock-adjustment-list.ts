import { Component, signal } from '@angular/core';
import { StockService } from '../../../../../core/services/stock-service';
import { LoaderService } from '../../../../../core/services/loader.service';
import { ActivatedRoute } from '@angular/router';
import { StockAdjustmentResponse } from '../../../../../model/response/stocks/stock-adjustment-response.model';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';

@Component({
  selector: 'app-stock-adjustment-list',
  imports: [CardModule,ToolbarModule,BreadcrumbModule,
    CommonModule,TableModule,TagModule,DataViewModule],
  templateUrl: './stock-adjustment-list.html',
  styleUrl: './stock-adjustment-list.css',
})
export class StockAdjustmentList {

  stockId?:string;
  stockAdjustment = signal<StockAdjustmentResponse | null>(null)

    breadcrumbItems: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/admin' },
    { label: 'Stock Adjustment List' }
  ];

  constructor(private route: ActivatedRoute,
    private stockService: StockService,
    private loaderService:LoaderService
  ) { 
  }

    ngOnInit() {

      this.stockId = this.route.snapshot.paramMap.get('id')!;
      if (this.stockId) {
       this.loadAdjustments(this.stockId);       
      } 
       
    }

    loadAdjustments(stockId: string) {
   
        this.loaderService.show();
      this.stockService.getStockAdjustments(stockId).subscribe({
        next: (res) => {
         this.stockAdjustment.set(res);
         this.loaderService.hide();
         console.log('asfadf');
         console.log(this.stockAdjustment());
       },
       error: (err) => {
        console.error(err);
       }
     });
  }
}
