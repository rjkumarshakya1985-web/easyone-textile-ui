import { Component } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { LocalStorageService } from '../../core/services/local-storage.service';

@Component({
  selector: 'app-header',
  standalone: true, 
  imports: [MenubarModule, ButtonModule, BadgeModule,Menu],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  items: MenuItem[] | undefined;
  roleName: string = '';
  isLogin: boolean = false;

  constructor(private storage: LocalStorageService) {

    this.initializeMenu();
     this.loadHeaderData();
  }

   private initializeMenu(): void {
    this.items = [
      {
        label: 'Options',
        items: [
          {
            label: 'Change Password',
            icon: 'pi pi-key',
            command: () => this.showDailog()
          }, {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => this.logout()
          },
        ]
      }
    ];
  }

  private loadHeaderData() {
    const token = this.storage.getToken();
    const user = this.storage.getUser();

    this.isLogin = !!token;

    if (this.isLogin && user) {
      this.roleName = user.roleName || 'User';
    }
  }

   logout() {
    this.storage.clearAll();
    window.location.reload();  
  }
   showDailog():void
   {

   }
  toggleSidebar() {
    // emit an event if you want to control sidebar visibility from parent
  }
}
