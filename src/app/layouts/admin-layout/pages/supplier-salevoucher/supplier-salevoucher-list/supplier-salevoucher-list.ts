
import { Component, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToolbarModule } from 'primeng/toolbar';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { DatePicker, DatePickerModule } from 'primeng/datepicker';
import { LoaderService } from '../../../../../core/services/loader.service';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

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
    InputTextModule,
    MenubarModule, 
    BadgeModule,
    SelectModule,
    DatePickerModule,
    DatePicker,
    ConfirmDialogModule,
    MenuModule,TagModule,
    CheckboxModule,
    DialogModule    
  ],
 templateUrl: './supplier-salevoucher-list.html',
  styleUrl: './supplier-salevoucher-list.css',
})
export class SupplierSalevoucherList {
  lrForm!: FormGroup;
  dialogHeader:string="Add LR"
  visible:boolean=false;
  tempDateRange: Date[] = [];
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
  saleVoucherId?:number;
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
  table.clear();              
  this.tempDateRange = [];
  this.searchControl.setValue('');  
}

onLazyLoad(event: any) {
  
 
  this.sortField = event.sortField ?? '';
  this.sortOrder = event.sortOrder ?? 1;

  const filters = event.filters;
 
  const dateRange = filters?.['date']?.[0]?.value;

  let fromDate: string | null = null;
  let toDate: string | null = null;

  // ✅ Clean logic
  if (dateRange!=null && dateRange.length > 0) {

    if ( dateRange[0]) {
      fromDate = this.formatDate(dateRange[0]);
      toDate = fromDate; // default same day
    }

    if (dateRange.length > 1 && dateRange[1]) {
      toDate = this.formatDate(dateRange[1]);
    }
  }

  
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
        billNumber: this.getFilterValue(filters,'billNumber'),
        department: this.getFilterValue(filters,'department'),
        fromDate: fromDate,
        toDate: toDate
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


  constructor(private fb: FormBuilder,
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
                         { label: '100', command: () => this.onPageSizeChange(100) },
                         { label: '200', command: () => this.onPageSizeChange(200) },
                        ]
            }
        ];

    this.lrForm = this.fb.group({
     id:[null,Validators.required],
     lrNumber: ['', Validators.required],
     lrDate: [null, Validators.required]
    });
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


  /// Date

  applyDateFilter(filterCallback: any) {
  filterCallback(this.tempDateRange); // 🔥 THIS LINE FIXES EVERYTHING
}


clearDateFilter(filterCallback: any) {
  this.tempDateRange = [];
  filterCallback(null);
}
  
formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);

  return `${year}-${month}-${day}`; // ✅ LOCAL yyyy-MM-dd
}
 /// Export checked unchecked
 onExportChange(row: SaleVoucherTableResponse) {

 
  this.saleVoucherService.markAsExported(row.id).subscribe({
    next: () => {
      console.log('Status updated');
    },
    error: () => {
     
    }
  });
 }

 /// LR
 showDialog(value: SaleVoucherTableResponse) {

   this.lrForm.patchValue({
     id: value.id,
     lrNumber: value.lrNumber,
     lrDate: value.lrDate ? new Date(value.lrDate) : null
   });
   this.visible = true;

}

 saveLrDetails() {
  if (this.lrForm.invalid) {
    this.lrForm.markAllAsTouched();
    return;
  }

  const formValue = this.lrForm.value;
   this.saleVoucherService.saveLr(formValue).subscribe(result=>{
    
     this.visible=false;
     this.loadTableData();
   })
}
}
