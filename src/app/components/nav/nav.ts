import { Component } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { LocalStorageService } from '../../core/services/local-storage.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [PanelMenuModule, RouterModule],
  templateUrl: './nav.html',
  styleUrls: ['./nav.css']
})
export class Nav {
  items: MenuItem[] = [];
  isLogin: boolean = false;
  userRole: string | null = null;

  constructor(private localStorage: LocalStorageService) {
    this.initializeMenu();
  }

  private initializeMenu() {
    const token = this.localStorage.getToken();
    const user = this.localStorage.getUser();

    this.isLogin = !!token;

    if (this.isLogin && user) {
      this.userRole = user.roleName; // role from backend: "Admin", "Supplier"
    }

    this.setMenu();
  }

  // MAIN LOGIC
  private setMenu() {
    if (!this.isLogin) {
      this.items = [];
      return;
    }

    if (this.userRole === 'SuperAdmin') {
      this.setAdminMenu();
    } else if (this.userRole === 'Supplier') {
      this.setSupplierMenu();
    } else if(this.userRole === 'StockIncharge')
    {
      this.setStoreOperator(); 
    }
    else {
      this.items = [];
    }
  }

  // Store Operator

  private setStoreOperator()
  {
     this.items = [
       {
        label: 'Parcel Scanners',
        icon: 'pi pi-fw pi-home',
        routerLink: ['/stock-incharge/parcel-scanners']
       },
       {
        label: 'Visitors',
        icon: 'pi pi-fw pi-users',
        routerLink: ['/stock-incharge/visitors']
      }
    ];
  }

  //---------------------------------------
  // Supplier Menu
  //---------------------------------------
  private setSupplierMenu() {
    this.items = [
      { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/supplier/dashboard'] },
      { label: 'Product', icon: 'pi pi-fw pi-box', routerLink: ['/supplier/products'] },
      { label: 'Sale Voucher', icon: 'pi pi-fw pi-file', routerLink: ['/supplier/salevouchers'] }
    ];
  }

  //---------------------------------------
  // Admin Menu
  //---------------------------------------
 private setAdminMenu() {
  this.items = [
    {
      label: 'Dashboard',
      icon: 'pi pi-fw pi-home',
      routerLink: ['/admin/dashboard']
    },
    {
      label: 'GST Rules',
      icon: 'pi pi-fw pi-book',
      routerLink: ['/admin/gstrule']
    },
    {
      label: 'Masters',
      icon: 'pi pi-fw pi-cog',
      items: [
        { label: 'HSN Codes', icon: 'pi pi-hashtag', routerLink: ['/admin/hsncodes'] },
        { label: 'Transports', icon: 'pi pi-truck', routerLink: ['/admin/transports'] },
        { label: 'Departments', icon: 'pi pi-building', routerLink: ['/admin/departments'] },
        { label: 'Product Categories', icon: 'pi pi-tags', routerLink: ['/admin/item-categories'] }
      ]
    },
    {
      label: 'Users',
      icon: 'pi pi-fw pi-user-plus',
      routerLink: ['/admin/users']
    },
    {
      label: 'Suppliers',
      icon: 'pi pi-fw pi-users',
      items: [
        { label: 'Supplier List', icon: 'pi pi-user', routerLink: ['/admin/suppliers'] },
        { label: 'Supplier Transports', icon: 'pi pi-truck', routerLink: ['/admin/supplier-transports'] },
        { label: 'Supplier Categories', icon: 'pi pi-tags', routerLink: ['/admin/supplier-stockgroups'] },
               { label: 'Supplier HsnCode', icon: 'pi pi-code', routerLink: ['/admin/supplier-hsncode'] },
        { label: 'Supplier Products', icon: 'pi pi-box', routerLink: ['/admin/supplier-products'] },
        { label: 'Supplier SaleVoucher', icon: 'pi pi-receipt', routerLink: ['/admin/supplier-salevoucher'] },
 
      ]
    },
    {
      label: 'Customers',
      icon: 'pi pi-fw pi-users',
      routerLink: ['/admin/customers']
    },
    {
      label: 'Reports',
      icon: 'pi pi-fw pi-chart-bar',
      items: [
        { label: 'Sales Report', icon: 'pi pi-chart-line', routerLink: ['/admin/sale-history'] },
        { label: 'Purchase Report', icon: 'pi pi-chart-pie', routerLink: ['/admin/purchase-history'] }
      ]
    }
  ];
}

}
