import { Component,Input  } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from '../../components/header/header';
import { Nav } from '../../components/nav/nav';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterModule,Header,Nav],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
   isSidebarOpen = true;

  handleToggle() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
