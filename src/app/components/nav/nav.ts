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
    } else {
      this.items = [];
    }
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
        label: 'Master Data',
        icon: 'pi pi-fw pi-cog',
        items: [
          { label: 'Hsn Code',icon: 'pi pi-hashtag', routerLink: ['/admin/hsncodes'] },
          { label: 'Transport',icon: 'pi pi-truck', routerLink: ['/admin/transports'] },
          { label: 'Department',icon: 'pi pi-building', routerLink: ['/admin/departments'] },
          { label: 'Product Category',icon: 'pi pi-tags', routerLink: ['/admin/item-categories'] }
        ]
      },
      {
        label: 'Supplier',
        icon: 'pi pi-fw pi-users',
        items: [
          { label: 'Suppliers', routerLink: ['/admin/suppliers'] },
          { label: 'Supplier Transports', routerLink: ['/admin/supplier-transports'] },
          { label: 'Supplier Products', routerLink: ['/admin/supplier-products'] }
        ]
      },
      {
        label: 'Customer',
        icon: 'pi pi-fw pi-users',
        routerLink: ['/admin/customers']
      },
      {
        label: 'Reports',
        icon: 'pi pi-fw pi-chart-bar',
        items: [
          { label: 'Sale History', routerLink: ['/admin/sale-history'] },
          { label: 'Purchase History', routerLink: ['/admin/purchase-history'] }
        ]
      }
    ];
  }
}
