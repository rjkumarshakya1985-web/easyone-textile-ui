import { Component, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Customer } from '../../../../../model/customer.model';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToolbarModule } from 'primeng/toolbar';
import { Menu, MenuModule } from 'primeng/menu';
import { CustomerResponse } from '../../../../../model/response/customer/customer-response.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TableDataRequest } from '../../../../../model/request/table-datafilter-request.model';
import { CustomerService } from '../../../../../core/services/customer-service';
import { PanelModule } from 'primeng/panel';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { TooltipModule } from 'primeng/tooltip';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-customer-list',
  imports: [ CommonModule,
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
    MenuModule,
    ConfirmDialogModule],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css',
})
export class CustomerList {

  @ViewChild('menu') menu!: Menu;
  items: MenuItem[] = [];
  // -----------------------------
  // Signals
  // -----------------------------
  isLoading = signal(false);
  tblResult = signal({ totalRows: 0, result: [] as CustomerResponse[] });

  pageSize = 10;
  pageindex = signal(0);



  // -----------------------------
  // Search Control
  // -----------------------------
  searchControl = new FormControl('');

  breadcrumbItems: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/admin' },
    { label: 'Customer' }
  ];

  constructor(private router: Router,private customerService:CustomerService) {}

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
  
      this.customerService.getCustomerTableData(req).subscribe({
        next: (res) => {
          this.tblResult.set(res);
        },
        complete: () => {
          this.isLoading.set(true);   // safe for change detection
        }
      });
    }
  
  customers: Customer[] = [
  {
    id: 1,
    customerName: 'Alpha Logistics',
    gstin: '27AAAAA1234A1Z5',
    registrationType: 'Regular',
    billingAddress: 'Andheri East, Mumbai',
    city: 101,
    pin: '400059',
    mobile: '9876543210',
    email: 'alpha@logistics.com',
    remarks: 'Priority transporter'
  },
  {
    id: 2,
    customerName: 'FastTrack Movers',
    gstin: '07BBBBB5678B2Z3',
    registrationType: 'Composition',
    billingAddress: 'Sector 10, Rohini',
    city: 102,
    pin: '110085',
    mobile: '9012345678',
    email: 'fasttrack@move.com',
    remarks: ''
  },
  {
    id: 3,
    customerName: 'Green Transport Co.',
    gstin: '07BBBBB5678B2Z3',
    registrationType: 'Unregistered',
    billingAddress: 'Baner, Pune',
    city: 103,
    state: 27,
    pin: '411045',
    mobile: '9123456780',
    email: '',
    remarks: 'Local transport'
  }
  ];


  goToAddCustomer() {
    this.router.navigate(['admin/customer/add']);
  }

  goToEditCustomer(id: number) {
    this.router.navigate(['admin/customer/edit', id]);
  }

  customerType(type:number):string
  {
     switch(type)
     {
      case 1:
        return "WholeSaler";
      case 2:
        return "Retailer";
      default:
      return "NF";
     }
  }

   getTransactionTypeName(value: number): string {
     switch (value) {
        case 1:
            return 'e-Fund Transfer';
        case 2:
            return 'Cheque';
        case 3:
            return 'Others';
        default:
           return 'Unknown';
      }
   }

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

}
