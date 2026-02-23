import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { PanelModule } from 'primeng/panel';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { TableDataRequest } from '../../../../../model/request/table-datafilter-request.model';
import { ProductHsnCode } from '../../../../../model/response/hsn-code.model';
import { MasterDataService } from '../../../../../core/services/master-data-service';
import { LoaderService } from '../../../../../core/services/loader.service';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PAGE_PAGE } from '../../../../../config/api.config';
import { Menu, MenuModule } from 'primeng/menu';
@Component({
  selector: 'app-hsn-code-list',
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
  DialogModule,
  ConfirmDialogModule,
    MenuModule,
],
  templateUrl: './hsn-code-list.html',
  styleUrls: ['./hsn-code-list.css']
})
export class HsnCodeList implements OnInit {
  pageSizeItems: MenuItem[] | undefined;
  sortField: string = '';
  sortOrder: number = 1; // 1 = ASC, -1 = DESC
   visible = false;
   hsnCodeForm!: FormGroup;
   items: MenuItem[] = [];
 
   // -----------------------------
  // Signals
  // -----------------------------
  isLoading = signal(false);
  tblResult = signal({ totalRows: 0, result: [] as ProductHsnCode[] });

  pageSize = PAGE_PAGE;
  pageIndex = signal(0);
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
    { label: 'HSN Codes' }
  ];

  constructor(private fb: FormBuilder,
    private router: Router,
    private confirmationService: ConfirmationService,
    private masterService: MasterDataService,
    private messageService: MessageService,
    private loader: LoaderService
  ) {

    this.hsnCodeForm = this.fb.group({
      departmentId:[null],
      name: ['', Validators.required],
      description: ['']
    });

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
  this.pageIndex.set(0);      // reset to first page
  this.pageSize = size;
  this.loadTableData(this.searchControl.value || '');
}
  showDialog() {
    this.visible = true;
     this.hsnCodeForm = this.fb.group({
      departmentId:[null],
      name: ['', Validators.required],
      description: ['']
    });
  }

  // -----------------------------
  // SEARCH WITH DEBOUNCE
  // -----------------------------
  setupSearch() {
    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(value => {
        this.pageIndex.set(0);
        this.loadTableData(value || '');
      });
  }

  // -----------------------------
  // LOAD DATA
  // -----------------------------
  loadTableData(search: string = '') {
    this.isLoading.set(false);

    const req: TableDataRequest = {
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize,
      search: search,
      sortField: this.sortField,
      sortOrder: this.sortOrder
    };

    this.masterService.getHsnCodeTableData(req).subscribe({
      next: (res) => {
        this.tblResult.set(res);
      },
      complete: () => {
        this.isLoading.set(true);
       
      }
    });
  }

  // -----------------------------
  // PAGINATION
  // -----------------------------
  numberOfPages(): number {
    return Math.ceil(this.tblResult().totalRows / this.pageSize);
  }

  onNext() {
    if (this.pageIndex() < this.numberOfPages() - 1) {
      this.pageIndex.set(this.pageIndex() + 1);
      this.loadTableData(this.searchControl.value || '');
    }
  }

  onPrevious() {
    if (this.pageIndex() > 0) {
      this.pageIndex.set(this.pageIndex() - 1);
      this.loadTableData(this.searchControl.value || '');
    }
  }

  // -----------------------------
  // ROUTING
  // -----------------------------
  goToAddHsnCode() {
    this.router.navigate(['admin/hsncodes/add']);
  }

  goToEditHsnCode(id: string) {
    this.router.navigate(['admin/hsncodes/edit', id]);
  }

  saveHsnCode()
  {
  
    if (this.hsnCodeForm.invalid) {
      this.hsnCodeForm.markAllAsTouched();
      return;
    }
    this.loader.show();
    const hsnCodeData = this.hsnCodeForm.value;

    this.masterService.createHsnCode(hsnCodeData).subscribe({
      next: res => {
        if (res) {
          this.visible = false;
          this.hsnCodeForm.reset();

           this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Hsn Code saved successfully!'
          });
          this.loader.hide();  
           this.loadTableData();
        } else {
          alert('Something went wrong');
        }
      },
      error: err => {
        console.error('Error:', err);
        alert('Error saving department');
      }
    });
  
  }

  deleteHsnCode(id: string) {
  this.confirmationService.confirm({
    header: 'Delete Hsn Code',
    message: 'Are you sure you want to delete this hsn code?',
    icon: 'pi pi-trash',
    acceptLabel: 'Yes',
    rejectLabel: 'No',
    acceptButtonStyleClass: 'p-button-danger',
    rejectButtonStyleClass: 'p-button-secondary',
    accept: () => {
      this.masterService.deleteHsnCode(id).subscribe(status => {
        if (status) {
          this.loadTableData();

          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Hsn Code deleted successfully'
          });
        }
      });
    }
  });
  }

}
