import { Component, OnInit, OnDestroy,Input } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { filter, Subscription } from 'rxjs';
import { ParcelStatus } from '../../core/enums/enum';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [PanelMenuModule, RouterModule],
  templateUrl: './nav.html',
  styleUrls: ['./nav.css']
})
export class Nav implements OnInit, OnDestroy {
 @Input() isOpen = true;
  items: MenuItem[] = [];
  isLogin = false;
  userRole: string | null = null;

  private subscription!: Subscription;

  constructor(private localStorage: LocalStorageService,private router: Router) {}

  ngOnInit(): void {
    this.loadUserMenu();
   this.subscription = this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => this.setActiveMenu());

  this.setActiveMenu(); 
   
  }

 

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // ---------------------------------------
  // MAIN LOGIC
  // ---------------------------------------
  private loadUserMenu(): void {
    const token = this.localStorage.getToken();
    const user = this.localStorage.getUser();

    this.isLogin = !!token;
    this.userRole = this.isLogin && user ? user.roleName : null;

    this.items = this.isLogin && this.userRole
      ? this.menuByRole[this.userRole] ?? []
      : [];
  }

  // ---------------------------------------
  // ROLE → MENU CONFIG
  // ---------------------------------------
  private menuByRole: Record<string, MenuItem[]> = {

    SuperAdmin: [
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
        label: 'People',
        icon: 'pi pi-fw pi-users',
        items: [
          {label: 'Users',icon: 'pi pi-fw pi-user-plus',routerLink: ['/admin/users']},
          {label: 'Customers',icon: 'pi pi-fw pi-user',routerLink: ['/admin/customers']},
          {label: 'Agents',icon: 'pi pi-fw pi-user',routerLink: ['/admin/agents']},
           {label: 'Sales Persons',icon: 'pi pi-fw pi-user',routerLink: ['/admin/sales-persons']}
        ]
      },
      {
        label: 'Suppliers',
        icon: 'pi pi-fw pi-users',
        items: [
          { label: 'Supplier List', icon: 'pi pi-user', routerLink: ['/admin/suppliers'] },
          { label: 'Supplier Transports', icon: 'pi pi-truck', routerLink: ['/admin/supplier-transports'] },
          { label: 'Supplier Categories', icon: 'pi pi-tags', routerLink: ['/admin/supplier-stockgroups'] },
          { label: 'Supplier HSN Code', icon: 'pi pi-code', routerLink: ['/admin/supplier-hsncode'] },
          { label: 'Supplier Products', icon: 'pi pi-box', routerLink: ['/admin/supplier-products'] },
          { label: 'Supplier Sale Voucher', icon: 'pi pi-receipt', routerLink: ['/admin/supplier-salevoucher'] }
        ]
      },
      {
        label: 'Parcel Management',
        icon: 'pi pi-fw pi-cog',
        items:[
           {
        label: 'Transit Scanning',
        icon: 'pi pi-fw pi-truck',
        routerLink: ['/stock-incharge/parcel-scanners',ParcelStatus.InTransit],
      },
      {
        label: 'Warehouse Scanning',
        icon: 'pi pi-fw pi-home',
        routerLink: ['/stock-incharge/parcel-scanners',ParcelStatus.Transport],
      },
      {
        label: 'Packed at Location',
        icon: 'pi pi-fw pi-box',
        routerLink: ['/stock-incharge/parcel-scanners',ParcelStatus.PackedAtLocation],
        
      }
        ]
      },
      {
         label: 'Stock Management',
         icon: 'pi pi-fw pi-warehouse',
         items: [
           { 
             label: 'Current Stock', 
             icon: 'pi pi-fw pi-box', 
             routerLink: ['/admin/stocks'] 
           },
           { 
             label: 'Stock Transactions', 
             icon: 'pi pi-fw pi-sort-alt', 
             routerLink: ['/admin/stock-transactions'] 
           }
        ]
      },
      {
        label: 'Reports',
        icon: 'pi pi-fw pi-chart-bar',
        items: [
          { label: 'Sales Report', icon: 'pi pi-chart-line', routerLink: ['/admin/sale-history'] },
          { label: 'Purchase Report', icon: 'pi pi-chart-pie', routerLink: ['/admin/purchase-history'] }
        ]
      }
    ],

    Supplier: [
      { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/supplier/dashboard'] },
      { label: 'Product', icon: 'pi pi-fw pi-box', routerLink: ['/supplier/products'] },
      { label: 'Sale Voucher', icon: 'pi pi-fw pi-file', routerLink: ['/supplier/salevouchers'] }
    ],

    StockIncharge: [
      {
        label: 'Transit Scanning',
        icon: 'pi pi-fw pi-truck',
        routerLink: ['/stock-incharge/parcel-scanners',ParcelStatus.InTransit],
      },
      {
        label: 'Warehouse Scanning',
        icon: 'pi pi-fw pi-home',
        routerLink: ['/stock-incharge/parcel-scanners',ParcelStatus.Transport],
        
      },
      {
        label: 'Packed at Location',
        icon: 'pi pi-fw pi-box',
        routerLink: ['/stock-incharge/parcel-scanners',ParcelStatus.PackedAtLocation],
        
      },
      {
        label: 'Visitors',
        icon: 'pi pi-fw pi-users',
        routerLink: ['/stock-incharge/visitors']
      }
    ]
  };

  private setActiveMenu() {
  const currentUrl = this.router.url.split('?')[0]; // remove query params

  const markActive = (items: MenuItem[]): boolean => {
    let anyChildActive = false;

    items.forEach(item => {
      item.styleClass = '';
      item.expanded = false;

      let isActive = false;

      if (item.routerLink) {
        const link = this.router.serializeUrl(
          this.router.createUrlTree(item.routerLink as any)
        );

        // Use startsWith instead of ===
        if (currentUrl.startsWith(link)) {
          isActive = true;
          item.styleClass = 'test-menu';
        }
      }

      if (item.items) {
        const childActive = markActive(item.items);

        if (childActive) {
          item.expanded = true;
          isActive = true;
        }
      }

      if (isActive) {
        anyChildActive = true;
      }
    });

    return anyChildActive;
  };

  markActive(this.items);
}
}
