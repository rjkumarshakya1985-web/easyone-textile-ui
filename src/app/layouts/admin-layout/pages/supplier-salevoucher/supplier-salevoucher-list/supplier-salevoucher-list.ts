
import { Component, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToolbarModule } from 'primeng/toolbar';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { TableDataRequest } from '../../../../../model/request/table-datafilter-request.model';
import { PanelModule } from 'primeng/panel';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { TooltipModule } from 'primeng/tooltip';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { Menu, MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SaleVoucherTableResponse } from '../../../../../model/response/salevouchers/salevoucher-table-response.model';
import { SaleVoucherService } from '../../../../../core/services/salevoucher.service';
import { ParcelStatus } from '../../../../../core/enums/enum';
import { ChipModule } from 'primeng/chip';
import { Helper } from '../../../../../core/helpers/helper';
import { TagModule } from 'primeng/tag';
import { PAGE_PAGE } from '../../../../../config/api.config';

@Component({
  selector: 'app-supplier-salevoucher-list',
  standalone: true,
  providers: [ConfirmationService],
  imports: [
   CommonModule,
    PanelModule,
    ButtonGroupModule,
    TableModule,
    CardModule,
    ButtonModule,
    BreadcrumbModule,
    ToolbarModule,
    TooltipModule,
    FloatLabelModule,
    ReactiveFormsModule,
    MenubarModule, 
    BadgeModule,
    ConfirmDialogModule,
    MenuModule,TagModule    
  ],
 templateUrl: './supplier-salevoucher-list.html',
  styleUrl: './supplier-salevoucher-list.css',
})
export class SupplierSalevoucherList {
 pageSizeItems: MenuItem[] | undefined;
  sortField: string = '';
  sortOrder: number = 1; // 1 = ASC, -1 = DESC
  @ViewChild('menu') menu!: Menu;
  items: MenuItem[] = [];
  ParcelStatusHelper = Helper;
  
  // -----------------------------
  // Signals
  // -----------------------------
  isLoading = signal(false);
  tblResult = signal({ totalRows: 0, result: [] as SaleVoucherTableResponse[] });

  pageSize = PAGE_PAGE;
  pageindex = signal(0);

  searchControl = new FormControl('');

  breadcrumbItems: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/supplier' },
    { label: 'SaleVoucher' }
  ];

private isFirstLoad = true;
    onLazyLoad(event: any) {
      if (this.isFirstLoad) {
    this.isFirstLoad = false;
    return;
  }
      this.sortField = event.sortField ?? '';
  this.sortOrder = event.sortOrder ?? 1;

  this.loadTableData(this.searchControl.value || '');
   }

  constructor(
    private router: Router,
    private saleVoucherService: SaleVoucherService,
  ) {}

  ngOnInit() {
    this.setupSearch();
    this.loadTableData();
    this.pageSizeItems = [
            {
                 items: [
                         { label: '5',  command: () => this.onPageSizeChange(5) },
                         { label: '10', command: () => this.onPageSizeChange(10) },
                         { label: '30', command: () => this.onPageSizeChange(30) },
                         { label: '50', command: () => this.onPageSizeChange(50) },
                         
                        ]
            }
        ];
  }
onPageSizeChange(size: number) {
  this.pageindex.set(0);      // reset to first page
  this.pageSize = size;
  this.loadTableData(this.searchControl.value || '');
}
  // -----------------------------
  // SEARCH
  // -----------------------------
  setupSearch() {
    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(value => {
        this.pageindex.set(0);
        this.loadTableData(value || '');
      });
  }

  // -----------------------------
  // LOAD TABLE
  // -----------------------------
  loadTableData(search: string = '') {
    this.isLoading.set(false);

    const req: TableDataRequest = {
      pageIndex: this.pageindex(),
      pageSize: this.pageSize,
      search,
      sortField: this.sortField,
      sortOrder: this.sortOrder
    };

    this.saleVoucherService.getTableData(req).subscribe({
      next: res => this.tblResult.set(res),
      complete: () => this.isLoading.set(true)
    });
  }

  // -----------------------------
  // PAGINATION
  // -----------------------------
  numberofPage(): number {
    return Math.ceil(this.tblResult().totalRows / this.pageSize);
  }

  onNext() {
    if (this.pageindex() < this.numberofPage() - 1) {
      this.pageindex.set(this.pageindex() + 1);
      this.loadTableData(this.searchControl.value || '');
    }
  }

  onPrevious() {
    if (this.pageindex() > 0) {
      this.pageindex.set(this.pageindex() - 1);
      this.loadTableData(this.searchControl.value || '');
    }
  }

  // -----------------------------
  // ROUTING
  // -----------------------------
  add() {
    this.router.navigate(['supplier/salevoucher/add']);
  }

  edit(id: string) {
    this.router.navigate(['supplier/product/edit', id]);
  }
  
  getStatusText(status: ParcelStatus): string {
  return ParcelStatus[status];
  }

  gotoEditSaleVoucher(id:number)
   {
    this.router.navigate(['admin/supplier-salevoucher-detail', id]);
   }

  goToPrint(id:number)
  {
    this.router.navigate(['admin/print',id]);
  }
   openMenu(event: Event, row: SaleVoucherTableResponse) {
       this.items = [{
            label: 'Detail',
            icon: 'pi pi-eye',
          command: () => this.gotoEditSaleVoucher(row.id)
        },
        {
          label: 'Print',
          icon: 'pi pi-print',
          command: () => this.goToPrint(row.id)
        }
      ];
    
      this.menu.toggle(event);
    
      }
}
