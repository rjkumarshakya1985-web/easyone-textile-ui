import { Component, signal, ViewChild } from '@angular/core';
import { SalePersonResponse } from '../../../../model/response/sales-persons/sales-persons-response';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { SalesPersonService } from '../../../../core/services/sales-persons-service';
import { TableDataRequest } from '../../../../model/request/table-datafilter-request.model';
import { Menu, MenuModule } from 'primeng/menu';
import { PAGE_PAGE } from '../../../../config/api.config';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Observable } from 'rxjs';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BadgeModule } from 'primeng/badge';
import { MenubarModule } from 'primeng/menubar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TooltipModule } from 'primeng/tooltip';
import { ToolbarModule } from 'primeng/toolbar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { PanelModule } from 'primeng/panel';
import { CommonModule } from '@angular/common';
import { State } from '../../../../model/state.model';
import { City } from '../../../../model/city.model';
import { MasterDataService } from '../../../../core/services/master-data-service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-sales-person-list',
  standalone: true,
  providers: [ConfirmationService],
  imports: [ CommonModule,
    
    PanelModule,
    ButtonGroupModule,
    TableModule,
    CardModule,
    ButtonModule,
    SelectModule,
    BreadcrumbModule,
    ToolbarModule,
    TooltipModule,
    FloatLabelModule,
    ReactiveFormsModule,
    InputTextModule,  
    MenubarModule, 
    BadgeModule,
    CheckboxModule,
    ConfirmDialogModule,
    MenuModule,DialogModule   ],
  templateUrl: './sales-person-list.html',
  styleUrl: './sales-person-list.css',
})
export class SalesPersonList {

  visible = false;
  salesPersonForm!: FormGroup;
  pageSizeItems: MenuItem[] | undefined;
  sortField: string = '';
  sortOrder: number = 1; // 1 = ASC, -1 = DESC
  @ViewChild('menu') menu!: Menu;
  items: MenuItem[] = [];

  states$!: Observable<State[]>;
  cities$!: Observable<City[]>;
  // -----------------------------
  // Signals
  // -----------------------------
  isLoading = signal(false);
  tblResult = signal({ totalRows: 0, result: [] as SalePersonResponse[] });

  pageSize = PAGE_PAGE;
  pageindex = signal(0);

  searchControl = new FormControl('');

  breadcrumbItems: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/supplier' },
    { label: 'Sales Persons' }
  ];


   constructor(private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private masterService: MasterDataService,
    private salesPersonService:SalesPersonService,
    private messageService: MessageService
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
    
    this.buildForm();
    this.states$ = this.masterService.getStates(); 

  }

  buildForm()
  {
  
    this.salesPersonForm = this.fb.group({
      id:[null],
      name:['', Validators.required],
      phoneNumber: ['', Validators.required],
      email:[''],
      address:['',Validators.required],
      stateId:[null,Validators.required],
      cityId:[null,Validators.required],
      isActive:[true]
    });

  }

  openAdd() {
    this.salesPersonForm.reset();
    this.salesPersonForm.patchValue({ isActive: true });
    this.visible = true;
  }

  openEdit(row: SalePersonResponse) {
    this.salesPersonForm.patchValue(row);
    this.visible = true;
  }

  onStateChange(event: any) {
    console.log(event);
    const stateId = event.value;
    this.cities$ = this.masterService.getCitiesByStateId(stateId);
    this.salesPersonForm.patchValue({ cityId: '' });
  }


  // -----------------------------
    // LOAD TABLE
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
  
      this.salesPersonService.getTableData(req).subscribe({
        next: res => this.tblResult.set(res.data),
        complete: () => this.isLoading.set(true)
      });
    }

    onPageSizeChange(size: number) {
      this.pageindex.set(0);      // reset to first page
      this.pageSize = size;
      this.loadTableData(this.searchControl.value || '');
    }
    
      // -----------------------------
      // SEARCH
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
    
    private isFirstLoad = true;
    onLazyLoad(event: any) {
        if (this.isFirstLoad) {
           this.isFirstLoad = false;
           return;
     }
   }
    
   save() {

      if (this.salesPersonForm.invalid) {
        this.salesPersonForm.markAllAsTouched();
        return;
     }
     const payload = this.salesPersonForm.value;

    this.salesPersonService.save(payload as any).subscribe({
      next: res => {
         if (res.success) {
           this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Saved successfully'
         });
          this.visible = false;
        this.loadTableData();
      }
      }
    });
  }


  deleteSalesPerson(id: string) {
  this.confirmationService.confirm({
    header: 'Delete Sales Person',
    message: 'Are you sure you want to delete this sales person?',
    icon: 'pi pi-trash',
    acceptLabel: 'Yes',
    rejectLabel: 'No',
    acceptButtonStyleClass: 'p-button-danger',
    rejectButtonStyleClass: 'p-button-secondary',

    accept: () => {
      this.salesPersonService.delete(id).subscribe({
        next: res => {
          if (res.success) {

            this.loadTableData();

            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'Sales Person deleted successfully'
            });

          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: res.message
            });
          }
        },
        error: err => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Something went wrong'
          });
        }
      });
    }
  });
}

   openMenu(event: any, row: SalePersonResponse) {
  this.items = [
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => this.openEdit(row)
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => {
        if (row.id) {
        this.deleteSalesPerson(row.id);
       }
      }
    }
  ];

  this.menu.toggle(event);
}
}
