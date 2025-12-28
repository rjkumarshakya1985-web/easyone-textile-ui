import { Component, OnInit, signal, effect, computed } from '@angular/core';
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

@Component({
  selector: 'app-transport-list',
  standalone: true,
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
  ],
  templateUrl: './transport-list.html',
  styleUrls: ['./transport-list.css']
})
export class TransportList implements OnInit {
  // -----------------------------
  // Signals
  // -----------------------------
  isLoading = signal(false);
  tblResult = signal({ totalRows: 0, result: [] as Transport[] });

  pageSize = 10;
  pageindex = signal(0);



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
      search: search
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
