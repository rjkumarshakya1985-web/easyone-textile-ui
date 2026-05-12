import { Component, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToolbarModule } from 'primeng/toolbar';
import { Menu, MenuModule } from 'primeng/menu';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TableDataRequest } from '../../../../../model/request/table-datafilter-request.model';
import { PanelModule } from 'primeng/panel';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { TooltipModule } from 'primeng/tooltip';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { PAGE_PAGE } from '../../../../../config/api.config';
import { VisitorService } from '../../../../../core/services/visitor-service';
import { VisitorResponse } from '../../../../../model/response/visitor/visitor-response.model';
@Component({
  selector: 'app-visitor-list',
  standalone: true,
  providers: [ConfirmationService], 
 imports: [ CommonModule,
    PanelModule,
    ButtonGroupModule,
    TableModule,
    CardModule,
    ButtonModule,
    BreadcrumbModule,
    ToolbarModule,
    TooltipModule,
    FloatLabelModule,
    ReactiveFormsModule,
    MenubarModule, 
    BadgeModule,
    MenuModule,
    ConfirmDialogModule],
  templateUrl: './visitor-list.html',
  styleUrl: './visitor-list.css',
})
export class VisitorList {
  pageSizeItems: MenuItem[] | undefined;
  sortField: string = '';
  sortOrder: number = 1; // 1 = ASC, -1 = DESC
  @ViewChild('menu') menu!: Menu;
  items: MenuItem[] = [];
  // -----------------------------
  // Signals
  // -----------------------------
  isLoading = signal(false);
  tblResult = signal({ totalRows: 0, result: [] as VisitorResponse[] });

  pageSize = PAGE_PAGE;
  pageindex = signal(0);
  private isFirstLoad = true;
    onLazyLoad(event: any) {
      if (this.isFirstLoad) {
    this.isFirstLoad = false;
    return;
  }
      this.sortField = event.sortField ?? '';
  this.sortOrder = event.sortOrder ?? 1;

  this.loadTableData(this.searchControl.value || '');
   }
   // -----------------------------
  // Search Control
  // -----------------------------
  searchControl = new FormControl('');

  breadcrumbItems: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/' },
    { label: 'Visitors' }
  ];
  constructor(
    private router: Router,
    private visitorService:VisitorService,
    private confirmationService:ConfirmationService, 
    private messageService:MessageService
  ) {}

   ngOnInit() {
    this.setupSearch();    
    this.loadTableData();
      this.pageSizeItems = [
            {
                 items: [
                         { label: '5',  command: () => this.onPageSizeChange(5) },
                         { label: '10', command: () => this.onPageSizeChange(10) },
                         { label: '30', command: () => this.onPageSizeChange(30) },
                         { label: '50', command: () => this.onPageSizeChange(50) },
                         
                        ]
            }
        ];
  }
onPageSizeChange(size: number) {
  this.pageindex.set(0);      // reset to first page
  this.pageSize = size;
  this.loadTableData(this.searchControl.value || '');
}
  // -----------------------------
    // SEARCH WITH DEBOUNCE
    // -----------------------------
    setupSearch() {
      this.searchControl.valueChanges
        .pipe(debounceTime(500), distinctUntilChanged())
        .subscribe(value => {
          this.pageindex.set(0);
          this.loadTableData(value || '');
        });
    }
  // -----------------------------
  // LOAD DATA
  // -----------------------------
  loadTableData(search: string = '') {
    this.isLoading.set(false);

    const req: TableDataRequest = {
      pageIndex: this.pageindex(),
      pageSize: this.pageSize,
      search,
      sortField: this.sortField,
      sortOrder: this.sortOrder
    };
      this.visitorService.getVisitorTableData(req).subscribe({
        next: (res) => {
          this.tblResult.set(res);
        },
        complete: () => {
          this.isLoading.set(true);   // safe for change detection
        }
      });
    }
  goToAddVisitor() {
    this.router.navigate(['/stock-incharge/visitor/add']);
  }

  goToEditVisitor(id: string) {
        this.router.navigate(['/stock-incharge/visitor/edit', id]);
  }

  goToPrintVisitor(id: string) {
        this.router.navigate(['/stock-incharge/visitor/print', id]);
  }

  deleteVisitor(id:string)
  {

  }
  customerType(type:number):string
  {
     switch(type)
     {
      case 1:
        return "WholeSaler";
      case 2:
        return "Retailer";
      default:
      return "NF";
     }
  }

   numberofPage(): number {
    return Math.ceil(this.tblResult().totalRows / this.pageSize);
   }

   onNext() {
    if (this.pageindex() < this.numberofPage() - 1) {
      this.pageindex.set(this.pageindex() + 1);
      this.loadTableData(this.searchControl.value || '');
    }
  }

  onPrevious() {
    if (this.pageindex() > 0) {
      this.pageindex.set(this.pageindex() - 1);
      this.loadTableData(this.searchControl.value || '');
    }
  }
  
}
