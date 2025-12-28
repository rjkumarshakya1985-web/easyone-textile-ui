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
import { SupplierService } from '../../../../../core/services/supplier-service';
import { TableDataRequest } from '../../../../../model/request/table-datafilter-request.model';
import { PanelModule } from 'primeng/panel';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { TooltipModule } from 'primeng/tooltip';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SupplierTableResponse } from '../../../../../model/response/supplier/supplier-table-response.model';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { Menu } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-supplier-list',
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
  templateUrl: './supplier-list.html',
  styleUrl: './supplier-list.css',
})
export class SupplierList {
  @ViewChild('menu') menu!: Menu;
  items: MenuItem[] = [];
  // -----------------------------
  // Signals
  // -----------------------------
  isLoading = signal(false);
  tblResult = signal({ totalRows: 0, result: [] as SupplierTableResponse[] });

  pageSize = 10;
  pageindex = signal(0);



  // -----------------------------
  // Search Control
  // -----------------------------
  searchControl = new FormControl('');

  breadcrumbItems: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/admin' },
    { label: 'Suppliers' }
  ];

  constructor(
    private router: Router,
    private supplierService: SupplierService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
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

    this.supplierService.getSupplierTableData(req).subscribe({
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

  deleteSupplier(id: string) {
  this.confirmationService.confirm({
    header: 'Delete Supplier',
    message: 'Are you sure you want to delete this supplier?',
    icon: 'pi pi-trash',
    acceptLabel: 'Yes',
    rejectLabel: 'No',
    acceptButtonStyleClass: 'p-button-danger',
    rejectButtonStyleClass: 'p-button-secondary',
    accept: () => {
      this.supplierService.updateStatusSupplier(id, 0).subscribe(status => {
        if (status) {
          this.loadTableData();

          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Supplier deleted successfully'
          });
        }
      });
    }
  });
 }

  toggleActive(response: SupplierTableResponse) {
   this.confirmationService.confirm({
    header: 'Change Status',
    message: 'Are you sure you want to change active status?',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Yes',
    rejectLabel: 'No',
    acceptButtonStyleClass: 'p-button-warning',
    rejectButtonStyleClass: 'p-button-secondary',
    accept: () => {
      this.supplierService.updateStatusSupplier(response.id, response.isActive ? 2 : 1)
        .subscribe(status => {
          if (status) {
            this.loadTableData();

            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.isActive
                ? 'Supplier deactivated successfully'
                : 'Supplier activated successfully'
            });
          }
        });
    }
  });
  }


  /////
  openMenu(event: Event, row: SupplierTableResponse) {
   this.items = [
     ...(row.isActive ? [{
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => this.goToEditSupplier(row.id)
    }] : []),
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => this.deleteSupplier(row.id)
    },
    {
      label: row.isActive ? 'Deactivate' : 'Activate',
      icon: row.isActive ? 'pi pi-times-circle' : 'pi pi-check-circle',
      command: () => this.toggleActive(row)
    }
  ];

  this.menu.toggle(event);

  }
}
