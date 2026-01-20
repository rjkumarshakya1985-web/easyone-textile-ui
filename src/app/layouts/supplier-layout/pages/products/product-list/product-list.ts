import { Component, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToolbarModule } from 'primeng/toolbar';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { SupplierProductDto } from '../../../../../model/entity/products/supplier-product.model';
import { TableDataRequest } from '../../../../../model/request/table-datafilter-request.model';
import { SupplierProductService } from '../../../../../core/services/supplier-product-service';
import { PanelModule } from 'primeng/panel';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { TooltipModule } from 'primeng/tooltip';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { Menu, MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-product-list',
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
    MenuModule   
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList {

  @ViewChild('menu') menu!: Menu;
  items: MenuItem[] = [];
  
  // -----------------------------
  // Signals
  // -----------------------------
  isLoading = signal(false);
  tblResult = signal({ totalRows: 0, result: [] as SupplierProductDto[] });

  pageSize = 10;
  pageindex = signal(0);

  searchControl = new FormControl('');

  breadcrumbItems: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/supplier' },
    { label: 'Products' }
  ];

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private supplierProductService: SupplierProductService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.setupSearch();
    this.loadTableData();
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
      search
    };

    this.supplierProductService.getTableData(req).subscribe({
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
  goToAddProduct() {
    this.router.navigate(['supplier/product/add']);
  }

  goToEditProduct(id: string) {
    this.router.navigate(['supplier/product/edit', id]);
  }
  
  
   toggleActive(product: SupplierProductDto) {

      this.confirmationService.confirm({
       header: 'Change Status',
       message: `Are you sure you want to ${product.isActive ? 'deactivate' : 'activate'} this product?`,
       icon: 'pi pi-exclamation-triangle',
       acceptLabel: 'Yes',
       rejectLabel: 'No',
       acceptButtonStyleClass: 'p-button-warning',
       rejectButtonStyleClass: 'p-button-secondary',
        accept: () => {
            this.supplierProductService.toggleActive(product.id)
           .subscribe({
             next: (status) => {
                 
               if (status) {
                 this.loadTableData(this.searchControl.value || '');

                 this.messageService.add({
                      severity: 'success',
                      summary: 'Success',
                      detail: product.isActive
                             ? 'Product deactivated successfully'
                             : 'Product activated successfully'
                       });
            }
          }
        });
    }
  });
}


  deleteProduct(id:string)
  {

  }

  printProduct(id:string)
  {
    
  }

  openMenu(event: Event, row: SupplierProductDto) {
     this.items = [{
      label:'Print',
      icon:'pi pi-print',
      command:()=>this.printProduct(row.id)
     },
       ...(row.isActive ? [{
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.goToEditProduct(row.id)
      }] : []),
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteProduct(row.id)
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
