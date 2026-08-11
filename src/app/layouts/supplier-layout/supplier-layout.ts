import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from '../../components/header/header';
import { Nav } from '../../components/nav/nav';

@Component({
  selector: 'app-supplier-layout',
  imports: [RouterModule,Header,Nav],
  templateUrl: './supplier-layout.html',
  styleUrl: './supplier-layout.css',
})
export class SupplierLayout {

  isSidebarOpen = true;

  handleToggle() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.saveSidebarState();
 }

  closeSidebarOnMobileMenuSelection(): void {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      this.isSidebarOpen = false;
    }
  }

  private saveSidebarState(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('easyone-sidebar-open', String(this.isSidebarOpen));
    }
  }
 
}
