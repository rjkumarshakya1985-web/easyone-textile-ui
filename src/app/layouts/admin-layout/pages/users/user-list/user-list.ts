import { Component, OnInit, signal } from '@angular/core';
import { UserResponse } from '../../../../../model/response/users/user-response.model';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { LoaderService } from '../../../../../core/services/loader.service';
import { TableDataRequest } from '../../../../../model/request/table-datafilter-request.model';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { FloatLabelModule } from 'primeng/floatlabel';
import { debounceTime, distinctUntilChanged, Observable } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { DepartmentResponse } from '../../../../../model/response/department/department.model';
import { MasterDataService } from '../../../../../core/services/master-data-service';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule,
  PanelModule,
  ButtonGroupModule,
  TableModule,
  CardModule,
  ButtonModule,SelectModule,
  BreadcrumbModule,
  ToolbarModule,
  TooltipModule,FloatLabelModule,
  InputTextModule,
  InputGroupModule,
  DialogModule,
  ConfirmDialogModule,CheckboxModule,
  ReactiveFormsModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {
  visible = false;
  userForm!: FormGroup;
  department$!: Observable<DepartmentResponse[]>;
   // -----------------------------
  // Signals
  // -----------------------------
  isLoading = signal(false);
  tblResult = signal({ totalRows: 0, result: [] as UserResponse[] });

  pageSize = 10;
  pageIndex = signal(0);
  searchControl = new FormControl('');
  
  breadcrumbItems: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/admin' },
    { label: 'Users' }
  ];

  roleTypes = [
    { name: 'Admin', value: 1 },
    { name: 'Cashier', value: 3 },
    { name: 'Packing Slip Operator', value: 4 },
    { name: 'Stock Incharge', value: 5 }
  ];
  
  constructor(private fb: FormBuilder,
    private masterService: MasterDataService,
    private router: Router,
    private userService:UserService,
    private messageService: MessageService,
    private loader: LoaderService
  ) {

    this.userForm = this.fb.group({
      id:[null],
      roleId:[null, Validators.required],
      userName: ['', Validators.required],
      password: ['',Validators.required],
      email:[''],
      phone:[''],
      departmentId:[null],
      isActive:[true]
    });

  }

  ngOnInit() {
    this.setupSearch();
    this.loadTableData();

    this.department$ = this.masterService.getDepartments();

    this.userForm.get('roleId')?.valueChanges.subscribe(role => {

    const deptControl = this.userForm.get('departmentId');

    if (role == 4) {
      deptControl?.setValidators([Validators.required]);
    } else {
      deptControl?.clearValidators();
      deptControl?.setValue(null);
    }

    deptControl?.updateValueAndValidity();
  });
  }

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
        search: search
      };
  
      this.userService.getUsers(req).subscribe({
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
  
    showDialog() {
      this.visible = true;
      this.userForm = this.fb.group({
         id:[null],
         roleId:[null, Validators.required],
         userName: ['', Validators.required],
         password: ['',Validators.required],
         email:[''],
         phone:[''],
         departmentId:[null],
         isActive:[true]
      });
    }

    editUser(user:UserResponse)
    {
       this.visible = true;
       this.loader.show();
       this.userService.getUser(user.id).subscribe(result=>{

          this.userForm = this.fb.group({
             id:user.id,
             roleId:user.role,
             userName: user.userName,
             password: user.password,
             email:user.email,
             phone:user.phone,
             departmentId:null,
            isActive:user.isActive
         });
        
          if (result.role == 4) {
            
             this.userForm.patchValue({
            departmentId: result.userDetail?.departmentId   
            });
        }
       this.loader.hide();
       });

     
    }
    

    getUserRole(role:number):string{
      
      switch(role)
      {
        case 1:
          return "Admin";
        case 3:
          return "Cashier";
        case 4:
          return "Packing Slip Operator";
        case 5:
        return "Stock Incharge";
        default:
          return "";
      }
    }

    submit():void
    {
     
      if (this.userForm.invalid) {
        this.userForm.markAllAsTouched();
        return;
     }
     
     this.loader.show();
     const userData = this.userForm.value;

     this.userService.saveUsers(userData).subscribe({
        next: res => {
          if (res) {
            this.visible = false;
            this.userForm.reset();

             this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User saved successfully!'
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
}
