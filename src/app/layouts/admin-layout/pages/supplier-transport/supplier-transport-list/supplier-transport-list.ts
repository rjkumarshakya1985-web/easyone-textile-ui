
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
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { SupplierService } from '../../../../../core/services/supplier-service';
import { TableDataRequest } from '../../../../../model/request/table-datafilter-request.model';
import { PanelModule } from 'primeng/panel';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { TooltipModule } from 'primeng/tooltip';
import { SupplierTransportResponse } from '../../../../../model/response/supplier-transport/supplier-trasnport-table-response.model';
import { ChipModule } from 'primeng/chip';
import { SupplierTransportDeleteRequest } from '../../../../../model/request/supplier/supplier-transport-delete-request.model';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteService } from '../../../../../core/services/auto-complete-service';
import { SupplierTableResponse } from '../../../../../model/response/supplier/supplier-table-response.model';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Transport } from '../../../../../model/transporter.model';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-supplier-transport-list',
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
    AutoCompleteModule    
  ],
   templateUrl: './supplier-transport-list.html',
  styleUrl: './supplier-transport-list.css',
  providers: [MessageService],
})
export class SupplierTransportList {

  selectedSupplier: any = null;
  filteredSuppliers = signal<SupplierTableResponse[]>([]);

  selectedTransport: any = null;
  filteredTransports = signal<Transport[]>([]);
  visible = false;
  // -----------------------------
  // Signals
  // -----------------------------
  isLoading = signal(false);
  tblResult = signal({ totalRows: 0, result: [] as SupplierTransportResponse[] });

  pageSize = 10;
  pageindex = signal(0);



  // -----------------------------
  // Search Control
  // -----------------------------
  searchControl = new FormControl('');

  breadcrumbItems: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/admin' },
    { label: 'Supplier Transports' }
  ];

  constructor(
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

    const req: TableDataRequest = {
      pageIndex: this.pageindex(),
      pageSize: this.pageSize,
      search: search
    };

    this.supplierService.getSupplierTransportTableData(req).subscribe({
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
  goToAddTransport() {
    this.router.navigate(['admin/transport/add']);
  }

  goToEditTransport(id: number) {
    this.router.navigate(['admin/transport/edit', id]);
  }

  onDeleteTransport(supplierId: string, transportId: number) {
  
    const request: SupplierTransportDeleteRequest = {
      supplierId: supplierId,
      transportId: transportId
    };

     this.supplierService.deleteSupplierTransport(request).subscribe(response=>{
       
      if(response)
       {
        this.loadTableData();
       }

     })
  }

   showDialog() {
    this.visible = true;
    this.selectedTransport=null;
    this.selectedSupplier =null;
  }

  /// Autocomplete
  goToAddSupplier(){

  }

  searchSupplier(event: any) {
  const query = event.query;
 
   this.autocompleteService.searchSupplier(query).subscribe(res => {
     this.filteredSuppliers.set(res); 
   });
 }

 searchTransport(event:any)
 {
   let supplierId= this.selectedSupplier.id
    const query = event.query;
    this.autocompleteService.searchOrphanTransport(query,supplierId).subscribe(res => {
     this.filteredTransports.set(res); 
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

    if (!this.selectedTransport || !this.selectedTransport.id) {
        this.messageService.add({
            severity: 'warn',
            summary: 'Select Transport',
            detail: 'Please select a transport first.'
        });
        return;
    }

    const supplierId = this.selectedSupplier.id;
    const transportId = this.selectedTransport.id;

    this.supplierService.assignSupplierTransport(supplierId, transportId)
        .subscribe({
            next: (result) => {
                if (result) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Transport assigned successfully.'
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
