
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToolbarModule } from 'primeng/toolbar';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Observable, of } from 'rxjs';

import { PanelModule } from 'primeng/panel';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { TooltipModule } from 'primeng/tooltip';
import { ChipModule } from 'primeng/chip';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToastModule } from 'primeng/toast';
import { SupplierTableResponse } from '../../../../model/response/supplier/supplier-table-response.model';
import { SupplierStockGroupResponse } from '../../../../model/response/supplier-stock-group/supplier-stockgroup.response';
import { SupplierService } from '../../../../core/services/supplier-service';
import { AutoCompleteService } from '../../../../core/services/auto-complete-service';
import { TableDataRequest } from '../../../../model/request/table-datafilter-request.model';
import { SupplierStockGroupDeleteRequest } from '../../../../model/request/supplier/supplier-transport-delete-request.model';
import { StockGroup } from '../../../../model/stock-group.model';
import { SelectModule } from 'primeng/select';
import { LoaderService } from '../../../../core/services/loader.service';

@Component({
  selector: 'app-supplier-stockgroup-list',
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
    ChipModule,
    FloatLabelModule,
    InputTextModule,
    ReactiveFormsModule,
    FormsModule,
    DialogModule,
    ToastModule,
    AutoCompleteModule,
    SelectModule    
  ],
   templateUrl: './supplier-category-list.html',
  styleUrl: './supplier-category-list.css',
  providers: [MessageService],
})
export class SupplierCategoryList {

  selectedSupplier: any = null;
  filteredSuppliers = signal<SupplierTableResponse[]>([]);
  stockGroup$!: Observable<StockGroup[]>;
  stockGroupId: number | null = null;

  
  visible = false;
  // -----------------------------
  // Signals
  // -----------------------------
  isLoading = signal(false);
  tblResult = signal({ totalRows: 0, result: [] as SupplierStockGroupResponse[] });

  pageSize = 10;
  pageindex = signal(0);



  // -----------------------------
  // Search Control
  // -----------------------------
  searchControl = new FormControl('');

  breadcrumbItems: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/admin' },
    { label: 'Supplier Category' }
  ];

  constructor(private loader: LoaderService,
    private router: Router,
    private messageService: MessageService,
    private supplierService: SupplierService,
    private autocompleteService:AutoCompleteService
  ) { }

  ngOnInit() {
    this.setupSearch();
    this.loadTableData();

     
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
    this.loader.show();
    const req: TableDataRequest = {
      pageIndex: this.pageindex(),
      pageSize: this.pageSize,
      search: search
    };
     
     this.supplierService.getSupplierStockGroupTableData(req).subscribe({
      next: (res) => {
        this.tblResult.set(res);
        
      },
      complete: () => {
        this.isLoading.set(true);   // safe for change detection
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
  goToAddTransport() {
    this.router.navigate(['admin/transport/add']);
  }

  goToEditTransport(id: number) {
    this.router.navigate(['admin/transport/edit', id]);
  }

  onDeleteStockGroup(supplierId: string, stockGroupId: number) {
  
    const request: SupplierStockGroupDeleteRequest = {
      supplierId: supplierId,
      stockGroupId: stockGroupId
    };

    
    this.supplierService.deleteSupplierStockGroup(request).subscribe({
        next: (response) => {
               if (response === true) {
                this.loadTableData();
                }
      },error: (err) => {
           this.loadTableData();
        }
     });
  }

   showDialog() {
    this.visible = true;
    this.selectedSupplier =null;
    this.stockGroup$ = of([]);
    this.stockGroupId = null
  }

  /// Autocomplete
  goToAddSupplier(){

  }

  onSupplierSelect(event: any) {
    if(event==null) return;
  const supplierId = event.value.id;
  this.stockGroup$ = this.supplierService.getGetOprhanStockGroup(supplierId);
 }

  searchSupplier(event: any) {
  const query = event.query;
 
   this.autocompleteService.searchSupplier(query).subscribe(res => {
     this.filteredSuppliers.set(res); 
   });
 }

 

 onSave() {

  if (!this.selectedSupplier || !this.selectedSupplier.id) {
        this.messageService.add({
            severity: 'warn',
            summary: 'Select Supplier',
            detail: 'Please select a supplier first.'
        });
        return;
    }

  if(this.stockGroupId==null)
    {
         this.messageService.add({
            severity: 'warn',
            summary: 'Select Category',
            detail: 'Please select a category first.'
        });
        return;
    }   

    const supplierId = this.selectedSupplier.id;

    this.supplierService.assignSupplierStockGroup(supplierId, this.stockGroupId)
        .subscribe({
            next: (result) => {
                if (result) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Stock group assigned successfully.'
                    });

                    this.visible = false;  
                    this.loadTableData();  
                }
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err?.error?.message || 'Something went wrong'
                });
            }
        });
 }
 
 onExport(){
  
 }
 
}
