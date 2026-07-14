
import { Component, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToolbarModule } from 'primeng/toolbar';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { TableDataRequest } from '../../../../../model/request/table-datafilter-request.model';
import { PanelModule } from 'primeng/panel';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { TooltipModule } from 'primeng/tooltip';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { Menu } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PAGE_PAGE } from '../../../../../config/api.config';
import { StockTableResponse } from '../../../../../model/response/stocks/stock-table-response.model';
import { StockService } from '../../../../../core/services/stock-service';
import { DialogModule } from 'primeng/dialog';

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
    InputTextModule,
    ReactiveFormsModule,
    MenubarModule, 
    BadgeModule,
    DialogModule,
    Menu,
    ConfirmDialogModule
  ],
  templateUrl: './stock-list.html',
  styleUrl: './stock-list.css',
})
export class StockList {
  pageSizeItems: MenuItem[] | undefined;
  sortField: string = '';
  visible = false;
  sortOrder: number = 1; // 1 = ASC, -1 = DESC
  @ViewChild('menu') menu!: Menu;
  items: MenuItem[] = [];
  stockAdjustmentForm!: FormGroup;
  curStockItem?:StockTableResponse;
  tblResult = signal({ totalRows: 0, result: [] as StockTableResponse[] });
  pageSize = PAGE_PAGE;
  pageindex = signal(0);
  searchControl = new FormControl('');
  breadcrumbItems: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/admin' },
    { label: 'Stock List' }
  ];

  stockAdjustmentTypes = [
      { label: 'In', value: 1 },
      { label: 'Out', value: 2 },
    ];

  constructor(private fb: FormBuilder,
    private router: Router,
    private stockService: StockService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { 

   this.stockAdjustmentForm = this.fb.group({
    stockId: ['', Validators.required],
    systemQty: [null, Validators.required],
    adjustmentQty: [null, Validators.required],
    newQty: [null, Validators.required],
    adjustmentType: [1, Validators.required],
    reason: ['']
  });

  }

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

//// Stock Adjust 

openMenu(event: Event,value:StockTableResponse) {
   
  this.items = [
    {
      label: 'Stock Adjustment',
      icon: 'pi pi-edit',
      command: () => this.openModel(value)
    },
     {
      label: 'Stock Adjustment List',
      icon: 'pi pi-edit',
      command: () => this.goStockAdjustmentList(value)
    }
  ];

  this.menu.toggle(event);

  }

goStockAdjustmentList(value:StockTableResponse)
{
   this.router.navigate(['admin/stock-adjustments', value.id]);
}  
openModel(value:StockTableResponse)
{
  this.curStockItem = value;
  this.visible=true;
  
   this.stockAdjustmentForm.patchValue({
     stockId: value.id,
     systemQty: value.availableQty,
     adjustmentQty: 0,
     newQty: value.availableQty,
     adjustmentType: 1,
    reason: ''
  });
  this.stockAdjustmentForm.get('systemQty')?.disable();
}

adjustStocks() {

  if (this.stockAdjustmentForm.invalid) {
    this.stockAdjustmentForm.markAllAsTouched();
    return;
  }

  const adjustmentQty = this.stockAdjustmentForm.get('adjustmentQty')?.value;

  if (adjustmentQty <= 0) {
    this.stockAdjustmentForm.get('adjustmentQty')?.setErrors({ invalidQty: true });
    return;
  }

  // ✅ get full data (including disabled fields)
  const payload = this.stockAdjustmentForm.getRawValue();

  this.stockService.stockAdjustment(payload).subscribe({
    next: (res: any) => {
           
      this.visible = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Stock Adjustment',
        detail: 'Stock adjusted successfully'
      });
      this.stockAdjustmentForm.reset();
      this.loadTableData();
    },
    error: (err: any) => {
      console.error('Error:', err);

      // optional: error toast
      // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
    }
  });
}

 calculateNewQty() {
  const systemQty = this.stockAdjustmentForm.get('systemQty')?.value || 0;
  const adjustmentQty = this.stockAdjustmentForm.get('adjustmentQty')?.value || 0;
  const type = this.stockAdjustmentForm.get('adjustmentType')?.value;

  let newQty = 0;

  if (type == 1) {
    newQty = systemQty + adjustmentQty;
  } else if (type == 2) {
    newQty = systemQty - adjustmentQty;

    if (newQty < 0) {
      newQty = 0;
      this.stockAdjustmentForm.get('adjustmentQty')?.setErrors({ exceed: true });
    }
  }

  this.stockAdjustmentForm.get('newQty')?.setValue(newQty, { emitEvent: false });
}
}
