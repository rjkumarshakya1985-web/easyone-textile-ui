
import { Component, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToolbarModule } from 'primeng/toolbar';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { TableDataRequest } from '../../../../../model/request/table-datafilter-request.model';
import { PanelModule } from 'primeng/panel';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { TooltipModule } from 'primeng/tooltip';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { Menu } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PAGE_PAGE } from '../../../../../config/api.config';
import { StockTableResponse } from '../../../../../model/response/stocks/stock-table-response.model';
import { StockService } from '../../../../../core/services/stock-service';

@Component({
  selector: 'app-stock-list',
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
    Menu,
    ConfirmDialogModule
  ],
  templateUrl: './stock-list.html',
  styleUrl: './stock-list.css',
})
export class StockList {
   pageSizeItems: MenuItem[] | undefined;
  sortField: string = '';
  sortOrder: number = 1; // 1 = ASC, -1 = DESC
  @ViewChild('menu') menu!: Menu;
  items: MenuItem[] = [];
  // -----------------------------
  // Signals
  // -----------------------------
  isLoading = signal(false);
  tblResult = signal({ totalRows: 0, result: [] as StockTableResponse[] });

 pageSize = PAGE_PAGE;
  pageindex = signal(0);



  // -----------------------------
  // Search Control
  // -----------------------------
  searchControl = new FormControl('');

  breadcrumbItems: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/admin' },
    { label: 'Stock List' }
  ];

  constructor(
    private router: Router,
    private stockService: StockService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

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
  // SEARCH WITH DEBOUNCE
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
  // LOAD DATA
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

    this.stockService.getTableData(req).subscribe({
      next: (res) => {
        this.tblResult.set(res);
      },
      complete: () => {
        this.isLoading.set(true);   // safe for change detection
      }
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
  goToAddSupplier() {
    this.router.navigate(['admin/supplier/add']);
  }

  goToEditSupplier(id: string) {
    this.router.navigate(['admin/supplier/edit', id]);
  }

 

 


  
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

}
