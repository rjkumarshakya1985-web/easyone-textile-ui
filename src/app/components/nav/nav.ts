import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy,Input } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { filter, Subscription } from 'rxjs';
import { ParcelStatus } from '../../core/enums/enum';
import { TooltipModule } from 'primeng/tooltip';
import { AdminMenuService } from '../../core/services/admin-menu.service';
import { AdminMenuSetting } from '../../model/admin-menu-setting.model';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, PanelMenuModule, RouterModule, TooltipModule],
  templateUrl: './nav.html',
  styleUrls: ['./nav.css']
})
export class Nav implements OnInit, OnDestroy {
 @Input() isOpen = true;
  items: MenuItem[] = [];
  isLogin = false;
  userRole: string | null = null;

  private subscription!: Subscription;

  constructor(
    private localStorage: LocalStorageService,
    private router: Router,
    private adminMenuService: AdminMenuService,
    private userService: UserService
  ) {}

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

    const roleMenu = this.isLogin && this.userRole
      ? this.cloneMenu(this.menuByRole[this.userRole] ?? [])
      : [];

    if (this.userRole !== 'SuperAdmin') {
      this.items = this.applyMenuKeys(roleMenu);
      return;
    }

    const applyAdminMenu = (isDeveloper: boolean, settings: AdminMenuSetting[] = []) => {
      this.items = this.filterAdminMenu(this.applyMenuKeys(roleMenu), settings, isDeveloper);
      this.setActiveMenu();
    };

    applyAdminMenu(!!user?.isDeveloper);

    this.userService.getCurrentUser().subscribe({
      next: (currentUser) => {
        const syncedUser = {
          ...user,
          isDeveloper: currentUser.isDeveloper
        };

        this.localStorage.setUser(syncedUser);

        this.adminMenuService.getSettings().subscribe({
          next: (settings) => applyAdminMenu(currentUser.isDeveloper, settings),
          error: () => applyAdminMenu(currentUser.isDeveloper)
        });
      },
      error: () => {
        applyAdminMenu(!!user?.isDeveloper);
      }
    });
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
          {label: 'Customer Agents',icon: 'pi pi-fw pi-user',routerLink: ['/admin/customer-agents']},
          {label: 'Supplier Agents',icon: 'pi pi-fw pi-user',routerLink: ['/admin/agents']},
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
      },
      {
        label: 'Menu Access',
        icon: 'pi pi-fw pi-shield',
        routerLink: ['/admin/menu-access']
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

  private cloneMenu(items: MenuItem[]): MenuItem[] {
    return items.map(item => ({
      ...item,
      items: item.items ? this.cloneMenu(item.items) : undefined
    }));
  }

  private applyMenuKeys(items: MenuItem[], parentKey?: string): MenuItem[] {
    return items.map(item => {
      const key = this.resolveMenuKey(item, parentKey);
      (item as any).key = key;

      if (item.items) {
        item.items = this.applyMenuKeys(item.items, key);
      }

      return item;
    });
  }

  private resolveMenuKey(item: MenuItem, parentKey?: string): string {
    const route = Array.isArray(item.routerLink) ? item.routerLink[0] : item.routerLink;
    const routeKeyMap: Record<string, string> = {
      '/admin/dashboard': 'admin.dashboard',
      '/admin/gstrule': 'admin.gstrule',
      '/admin/hsncodes': 'admin.hsncodes',
      '/admin/transports': 'admin.transports',
      '/admin/departments': 'admin.departments',
      '/admin/item-categories': 'admin.item-categories',
      '/admin/users': 'admin.users',
      '/admin/customers': 'admin.customers',
      '/admin/customer-agents': 'admin.customer-agents',
      '/admin/agents': 'admin.agents',
      '/admin/sales-persons': 'admin.sales-persons',
      '/admin/suppliers': 'admin.supplier-list',
      '/admin/supplier-transports': 'admin.supplier-transports',
      '/admin/supplier-stockgroups': 'admin.supplier-stockgroups',
      '/admin/supplier-hsncode': 'admin.supplier-hsncode',
      '/admin/supplier-products': 'admin.supplier-products',
      '/admin/supplier-salevoucher': 'admin.supplier-salevoucher',
      '/admin/stocks': 'admin.stocks',
      '/admin/stock-transactions': 'admin.stock-transactions',
      '/admin/menu-access': 'admin.menu-access'
    };

    if (typeof route === 'string' && routeKeyMap[route]) {
      return routeKeyMap[route];
    }

    const labelKeyMap: Record<string, string> = {
      'Masters': 'admin.masters',
      'People': 'admin.people',
      'Suppliers': 'admin.suppliers',
      'Parcel Management': 'admin.parcel-management',
      'Transit Scanning': 'admin.transit-scanning',
      'Warehouse Scanning': 'admin.warehouse-scanning',
      'Packed at Location': 'admin.packed-location',
      'Stock Management': 'admin.stock-management',
      'Reports': 'admin.reports',
      'Sales Report': 'admin.sales-report',
      'Purchase Report': 'admin.purchase-report'
    };

    if (item.label && labelKeyMap[item.label]) {
      return labelKeyMap[item.label];
    }

    return `${parentKey ?? 'menu'}.${(item.label ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
  }

  private filterAdminMenu(items: MenuItem[], settings: AdminMenuSetting[], isDeveloper: boolean): MenuItem[] {
    if (isDeveloper) {
      return items;
    }

    const enabledByKey = new Map(settings.map(item => [item.menuKey, item.isEnabled]));

    const filterItems = (menuItems: MenuItem[]): MenuItem[] => {
      return menuItems.reduce<MenuItem[]>((result, item) => {
        const key = (item as any).key as string;
        const isMenuAccess = key === 'admin.menu-access';
        const isEnabled = key === 'admin.menu-access' && isDeveloper
          ? true
          : !isMenuAccess && enabledByKey.get(key) !== false;

        const children = item.items ? filterItems(item.items) : undefined;

        if (!isEnabled || (item.items && !children?.length)) {
          return result;
        }

        result.push({
          ...item,
          items: children
        });

        return result;
      }, []);
    };

    return filterItems(items);
  }

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

  goToMenuItem(item: MenuItem) {
    if (item.routerLink) {
      this.router.navigate(item.routerLink as any[]);
      return;
    }

    const firstChildWithRoute = item.items?.find(child => child.routerLink);
    if (firstChildWithRoute?.routerLink) {
      this.router.navigate(firstChildWithRoute.routerLink as any[]);
    }
  }
}
