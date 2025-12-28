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

}
