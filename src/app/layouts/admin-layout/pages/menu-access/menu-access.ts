import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ToolbarModule } from 'primeng/toolbar';
import { AdminMenuCatalogItem, ADMIN_MENU_CATALOG } from '../../../../core/menu/admin-menu-catalog';
import { AdminMenuService } from '../../../../core/services/admin-menu.service';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { LoaderService } from '../../../../core/services/loader.service';
import { AdminMenuSetting } from '../../../../model/admin-menu-setting.model';

interface MenuAccessItem extends AdminMenuCatalogItem {
  isEnabled: boolean;
}

@Component({
  selector: 'app-menu-access',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToolbarModule,
    BreadcrumbModule,
    CardModule,
    CheckboxModule,
    ButtonModule
  ],
  templateUrl: './menu-access.html',
  styleUrl: './menu-access.css'
})
export class MenuAccess implements OnInit {
  items = signal<MenuAccessItem[]>([]);

  breadcrumbItems: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/admin' },
    { label: 'Menu Access' }
  ];

  constructor(
    private adminMenuService: AdminMenuService,
    private storage: LocalStorageService,
    private router: Router,
    private loader: LoaderService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const user = this.storage.getUser();

    if (!user?.isDeveloper || user.roleName !== 'SuperAdmin') {
      this.router.navigate(['/admin/dashboard']);
      return;
    }

    this.load();
  }

  load(): void {
    this.loader.show();

    this.adminMenuService.getSettings().subscribe({
      next: (settings) => this.items.set(this.mergeSettings(settings)),
      error: () => {
        this.items.set(this.mergeSettings([]));
        this.messageService.add({
          severity: 'warn',
          summary: 'Menu Access',
          detail: 'Default menu list loaded.'
        });
      },
      complete: () => this.loader.hide()
    });
  }

  parentItems(): MenuAccessItem[] {
    return this.items().filter(item => !item.parentKey);
  }

  childItems(parentKey: string): MenuAccessItem[] {
    return this.items().filter(item => item.parentKey === parentKey);
  }

  onParentToggle(parent: MenuAccessItem): void {
    const nextItems = this.items().map(item => {
      if (item.key === parent.key || item.parentKey === parent.key) {
        return { ...item, isEnabled: parent.isEnabled };
      }

      return item;
    });

    this.items.set(nextItems);
  }

  onChildToggle(child: MenuAccessItem): void {
    if (!child.parentKey || !child.isEnabled) {
      this.items.set([...this.items()]);
      return;
    }

    const nextItems = this.items().map(item =>
      item.key === child.parentKey ? { ...item, isEnabled: true } : item
    );

    this.items.set(nextItems);
  }

  save(): void {
    this.loader.show();

    const request = {
      items: this.items().map(item => ({
        menuKey: item.key,
        label: item.label,
        isEnabled: item.isEnabled
      }))
    };

    this.adminMenuService.saveSettings(request).subscribe({
      next: () => {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('easyone-admin-menu-settings', JSON.stringify(request.items));
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Saved',
          detail: 'Menu access updated successfully.'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Menu access save nahi hua.'
        });
      },
      complete: () => this.loader.hide()
    });
  }

  private mergeSettings(settings: AdminMenuSetting[]): MenuAccessItem[] {
    const enabledByKey = new Map(settings.map(item => [item.menuKey, item.isEnabled]));

    return ADMIN_MENU_CATALOG.map(item => ({
      ...item,
      isEnabled: enabledByKey.get(item.key) ?? true
    }));
  }
}
