import { Component } from '@angular/core';
import { Nav } from '../../components/nav/nav';

import { RouterModule } from '@angular/router';
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-store-operator-layout',
  imports: [RouterModule,Header,Nav],
  templateUrl: './store-operator-layout.html',
  styleUrl: './store-operator-layout.css',
})
export class StoreOperatorLayout {

  isSidebarOpen = true;

  handleToggle() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.saveSidebarState();
  }

  private saveSidebarState(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('easyone-sidebar-open', String(this.isSidebarOpen));
    }
  }
}
