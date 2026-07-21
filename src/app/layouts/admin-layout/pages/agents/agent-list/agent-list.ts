import { Component, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToolbarModule } from 'primeng/toolbar';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AgentService } from '../../../../../core/services/agent-service';
import { TableDataRequest } from '../../../../../model/request/table-datafilter-request.model';
import { PanelModule } from 'primeng/panel';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { TooltipModule } from 'primeng/tooltip';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { AgentTableResponse } from '../../../../../model/response/agent/agent-table-response.model';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { Menu } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PAGE_PAGE } from '../../../../../config/api.config';
@Component({
  selector: 'app-agent-list',
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
    InputTextModule,
    ReactiveFormsModule,
    MenubarModule, 
    BadgeModule,
    Menu,
    ConfirmDialogModule
  ],
  templateUrl: './agent-list.html',
  styleUrl: './agent-list.css',
})
export class AgentList {
  agentType = 1;
  pageTitle = 'Supplier Agents';
   pageSizeItems: MenuItem[] | undefined;
  sortField: string = '';
  sortOrder: number = 1; // 1 = ASC, -1 = DESC
  @ViewChild('menu') menu!: Menu;
  items: MenuItem[] = [];
  // -----------------------------
  // Signals
  // -----------------------------
  isLoading = signal(false);
  tblResult = signal({ totalRows: 0, result: [] as AgentTableResponse[] });

 pageSize = PAGE_PAGE;
  pageindex = signal(0);



  // -----------------------------
  // Search Control
  // -----------------------------
  searchControl = new FormControl('');

  breadcrumbItems: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/admin' },
    { label: this.pageTitle }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private agentService: AgentService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.agentType = Number(this.route.snapshot.data['agentType'] ?? 1);
    this.pageTitle = this.agentType === 2 ? 'Customer Agents' : 'Supplier Agents';
    this.breadcrumbItems[1].label = this.pageTitle;
  }

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

    this.agentService.getAgentTableData(req, this.agentType).subscribe({
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
  goToAddAgent() {
    this.router.navigate([this.agentType === 2 ? 'admin/customer-agent/add' : 'admin/agent/add']);
  }

  goToEditAgent(id: string) {
    this.router.navigate([this.agentType === 2 ? 'admin/customer-agent/edit' : 'admin/agent/edit', id]);
  }

  deleteAgent(id: string) {
  this.confirmationService.confirm({
    header: 'Delete Agent',
    message: 'Are you sure you want to delete this Agent?',
    icon: 'pi pi-trash',
    acceptLabel: 'Yes',
    rejectLabel: 'No',
    acceptButtonStyleClass: 'p-button-danger',
    rejectButtonStyleClass: 'p-button-secondary',
    accept: () => {
      this.agentService.updateStatusAgent(id, 0, this.agentType).subscribe(status => {
        if (status) {
          this.loadTableData();

          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Agent deleted successfully'
          });
        }
      });
    }
  });
 }

  toggleActive(response: AgentTableResponse) {
   this.confirmationService.confirm({
    header: 'Change Status',
    message: 'Are you sure you want to change active status?',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Yes',
    rejectLabel: 'No',
    acceptButtonStyleClass: 'p-button-warning',
    rejectButtonStyleClass: 'p-button-secondary',
    accept: () => {
      this.agentService.updateStatusAgent(response.id, response.isActive ? 2 : 1, this.agentType)
        .subscribe(status => {
          if (status) {
            this.loadTableData();

            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.isActive
                ? 'Agent deactivated successfully'
                : 'Agent activated successfully'
            });
          }
        });
    }
  });
  }


  /////
  openMenu(event: Event, row: AgentTableResponse) {
   this.items = [
     ...(row.isActive ? [{
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => this.goToEditAgent(row.id)
    }] : []),
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => this.deleteAgent(row.id)
    },
    {
      label: row.isActive ? 'Deactivate' : 'Activate',
      icon: row.isActive ? 'pi pi-times-circle' : 'pi pi-check-circle',
      command: () => this.toggleActive(row)
    }
  ];

  this.menu.toggle(event);

  }
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

}
