import { Component, OnInit, signal, effect, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { PanelModule } from 'primeng/panel';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TransportService } from '../../../../../core/services/transport-service';
import { TableDataRequest } from '../../../../../model/request/table-datafilter-request.model';
import { RegistrationType, TransportType } from '../../../../../core/enums/enum';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { Transport } from '../../../../../model/transporter.model';
import { Menu, MenuModule } from 'primeng/menu';
import { PAGE_PAGE } from '../../../../../config/api.config';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-transport-list',
  standalone: true, 
   providers: [ConfirmationService],  
  imports: [
    CommonModule,
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
    InputTextModule,
    InputGroupModule,
    MenuModule,
    ConfirmDialogModule
  ],
  templateUrl: './transport-list.html',
  styleUrls: ['./transport-list.css']
})
export class TransportList implements OnInit {
  pageSizeItems: MenuItem[] | undefined;
  sortField: string = '';
  sortOrder: number = 1; // 1 = ASC, -1 = DESC
  items: MenuItem[] = [];
  @ViewChild('menu') menu!: Menu;
  // -----------------------------
  // Signals
  // -----------------------------
  isLoading = signal(false);
  tblResult = signal({ totalRows: 0, result: [] as Transport[] });

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
    { label: 'Dashboard', routerLink: '/admin' },
    { label: 'Transports' }
  ];

  constructor(
    private router: Router,
    private transportService: TransportService
  ) { }

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
      search: search,
      sortField: this.sortField,
      sortOrder: this.sortOrder
    };

    this.transportService.getTableData(req).subscribe({
      next: (res) => {
        this.tblResult.set(res);
      },
      complete: () => {
        this.isLoading.set(true);   // safe for change detection
      }
    });
  }

  // -----------------------------
  // PAGINATION
  // -----------------------------
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

  // -----------------------------
  // ROUTING
  // -----------------------------
  goToAddTransport() {
    this.router.navigate(['admin/transport/add']);
  }

  goToEditTransport(id: number) {
    this.router.navigate(['admin/transport/edit', id]);
  }

  openMenu(event: Event, row: Transport) {
    this.items = [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.goToEditTransport(row.id)
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {}
      }
    ];

    this.menu.toggle(event);
  }

 getRegTypeText(value: number): string {
  switch (value) {
    case RegistrationType.Regular:
      return "Regular";
    case RegistrationType.Composition:
      return "Composition";
    case RegistrationType.Unregistered:
      return "Unregistered";
    default:
      return "-";
   }
  }

  
  getTransportTypeText(value: number): string {
  const map: Record<number, string> = {
    [TransportType.Purchase]: 'Purchase',
    [TransportType.Sales]: 'Sales',
    [TransportType.Both]: 'Both'
  };

  return map[value] ?? '-';
}

}
