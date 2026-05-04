import { Component } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem, MessageService } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { UserService } from '../../core/services/user.service';
import {  EventEmitter, Output } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { CommonModule } from '@angular/common';
import { ExportSalevoucher } from '../export-salevoucher/export-salevoucher';

@Component({
  selector: 'app-header',
  standalone: true, 
  imports: [CommonModule,MenubarModule, ButtonModule, BadgeModule,Menu,DialogModule,
    ReactiveFormsModule,InputTextModule,DrawerModule,ExportSalevoucher],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Output() toggleSidebar = new EventEmitter<void>();
  visible2: boolean = false;
  isExportSaleVoucher:boolean = false;
  visible = false;
  items: MenuItem[] | undefined;
  roleName: string = '';
  isLogin: boolean = false;
  credentialForm!: FormGroup;

  constructor(private fb: FormBuilder,private storage: LocalStorageService,
    private userService:UserService,private messageService: MessageService,
     ) {

    this.credentialForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['',Validators.required]
    });

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

    if (!this.isLogin || !user) {
      this.roleName = '';
       return;
    }

     if (user.roleName === 'Supplier') {
      this.roleName = `Welcome ${user.name}`;   
     } else {

      this.isExportSaleVoucher=true;
      this.roleName = `Welcome ${user.roleName}`;
    }
}


   logout() {
    this.storage.clearAll();
    window.location.reload();  
  }
   showDailog():void
   {
       this.visible = true;
       this.credentialForm.reset();
   }

   onToggleClick() {
    this.toggleSidebar.emit();
   }

   changePassword():void
    {
       this.userService.changePassword(this.credentialForm.value).subscribe({
            next: (status:boolean) => {
               
              this.messageService.add({
                    severity: 'success',
                    summary: 'Password Changed',
                    detail: 'Your password has been changed successfully. You will be logged out.',
                life: 3000
               });

     
               this.visible = false;
               this.credentialForm.reset();

      
                 setTimeout(() => {
                  this.logout();
                 }, 3000);

            }
      });
    }

    openExportSaleVoucher()
    {
      this.visible2 = true
    }
}
