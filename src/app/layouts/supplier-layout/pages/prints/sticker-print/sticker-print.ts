import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-sticker-print',
  imports: [ToolbarModule,BreadcrumbModule,ButtonModule,CardModule],
  templateUrl: './sticker-print.html',
  styleUrl: './sticker-print.css',
})
export class StickerPrint {

  breadcrumbItems: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/supplier' },
    { label: 'Print Sticker' }
  ];
 
  printSticker():void{
    
  }
}
