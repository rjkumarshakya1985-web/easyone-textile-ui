
import { Component, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToolbarModule } from 'primeng/toolbar';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { Helper } from '../../../../../core/helpers/helper';
import { TagModule } from 'primeng/tag';
import { PAGE_PAGE } from '../../../../../config/api.config';
import { SelectModule } from 'primeng/select';

import { LoaderService } from '../../../../../core/services/loader.service';

@Component({
  selector: 'app-supplier-salevoucher-list',
  standalone: true,
  providers: [ConfirmationService],
  imports: [
   CommonModule,FormsModule,
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
    SelectModule,
    ConfirmDialogModule,
    MenuModule,TagModule,    
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
  filters: { [key: string]: string | null } = {};
  supplierInput: string = '';
  statusInput: number | null = null;
  transportInput:string=''
  supplierNumber:string=''
  saleVoucherNumber: number | null = null;
 
  // -----------------------------
  // Signals
  // -----------------------------
 
  tblResult = signal({ totalRows: 0, result: [] as SaleVoucherTableResponse[] });

  pageSize = PAGE_PAGE;
  pageindex = signal(0);

  searchControl = new FormControl('');

  parcelStatusList = [
  { label: 'In Transit', value: 3 },
  { label: 'Transport', value: 4 },
  { label: 'Packed At Location', value: 5 },
  { label: 'Opened', value: 6 },
  { label: 'Tally Synched', value: 11 }
];

  breadcrumbItems: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/supplier' },
    { label: 'SaleVoucher' }
  ];



clear(table: any) {
  table.clear();              // ✅ PrimeNG filters clear
  this.searchControl.setValue('');  // ✅ search textbox clear
}

onLazyLoad(event: any) {
  
 
  this.sortField = event.sortField ?? '';
  this.sortOrder = event.sortOrder ?? 1;

  const filters = event.filters;

  this.pageindex.set(0);
  const request: TableDataRequest = {
    pageIndex: this.pageindex(),
    pageSize: this.pageSize,
    search: this.searchControl.value || '',
    sortField: this.sortField,
    sortOrder: this.sortOrder,
    filters: {
        saleVoucherNumber: this.getFilterValue(filters, 'saleVoucherNumber'),
        supplierName: this.getFilterValue(filters, 'supplierName'),
        tranportName: this.getFilterValue(filters, 'tranportName'),
        parcelStatus: this.getFilterValue(filters, 'parcelStatus'),
        billNumber: this.getFilterValue(filters,'billNumber')
     }
  };

  this.filters = request.filters || {}
  this.loadTableDataFromLazy(request);
}

getFilterValue(filters: any, field: string): string {
  const val = filters?.[field]?.[0]?.value;

  if (val === null || val === undefined || val === '') {
    return '';
  }

  return val.toString(); // 🔥 convert to string
}

loadTableDataFromLazy(req: TableDataRequest) {
  this.loader.show();

  this.saleVoucherService.getTableData(req).subscribe({
    next: res => this.tblResult.set(res),
    complete: () => {
      this.loader.hide();
    }
  });
}


  constructor(
    private router: Router,
     private loader: LoaderService,
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
  
    this.loader.show();
    const req: TableDataRequest = {
      pageIndex: this.pageindex(),
      pageSize: this.pageSize,
      search,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      filters: Object.keys(this.filters).length 
  ? this.filters 
  : undefined
    };

    this.saleVoucherService.getTableData(req).subscribe({
      next: res => this.tblResult.set(res),
      complete: () => {
     
      this.loader.hide();
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
  add() {
    this.router.navigate(['admin/add-supplier-salevoucher/add']);
  }

  edit(id: number) {
    this.router.navigate(['admin/add-supplier-salevoucher/', id]);
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

  this.items = [
    {
      label: 'Detail',
      icon: 'pi pi-eye',
      command: () => this.gotoEditSaleVoucher(row.id)
    }
  ];

  // 👇 Only add Edit if NOT InWareHouse
  if (row.parcelStatus < ParcelStatus.Opened) {
    this.items.push({
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => this.edit(row.id)
    });
  }

  this.items.push({
    label: 'Print',
    icon: 'pi pi-print',
    command: () => this.goToPrint(row.id)
  });

  
 
  this.menu.toggle(event);
  }

  
}
