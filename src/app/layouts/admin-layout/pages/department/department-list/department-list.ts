import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { MasterDataService } from '../../../../../core/services/master-data-service';
import { DepartmentResponse } from '../../../../../model/response/department/department.model';
import { Router } from '@angular/router';
import { FloatLabelModule } from 'primeng/floatlabel';
import { LoaderService } from '../../../../../core/services/loader.service';

@Component({
  selector: 'app-department-list',
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
    ReactiveFormsModule,
    DialogModule,
    FloatLabelModule
  ],
  templateUrl: './department-list.html',
  styleUrl: './department-list.css'
})
export class DepartmentList {

  isLoading = signal(false);
  tableData = signal<DepartmentResponse[]>([]);   // <-- FIXED

  visible = false;
  departmentForm!: FormGroup;

  constructor(private fb: FormBuilder,private router: Router,
    private masterService: MasterDataService,
    private messageService: MessageService,
    private loader: LoaderService) {

    this.departmentForm = this.fb.group({
      departmentId:[null],
      name: ['', Validators.required],
      description: ['']
    });

    this.loadDepartments();    // <-- Auto-load list
  }

  loadDepartments() {
    this.isLoading.set(false);

    this.masterService.getDepartments().subscribe({
      next: res => {
        this.tableData.set(res);
      },
      complete: () => {
        this.isLoading.set(true);
      }
    });
  }

  showDialog() {
    this.visible = true;
     this.departmentForm = this.fb.group({
      departmentId:[null],
      name: ['', Validators.required],
      description: ['']
    });
  }

  saveDepartment() {
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }
    this.loader.show();
    const departmentData = this.departmentForm.value;

    this.masterService.saveDepartment(departmentData).subscribe({
      next: res => {
        if (res) {
          this.visible = false;
          this.departmentForm.reset();

           this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Supplier saved successfully!'
          });
          this.loader.hide();
          this.loadDepartments();   
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

  gotoSubDepartment(id:number)
  {
    this.router.navigate(['admin/sub-departments', id]);
  
  }

  editDepartment(value:DepartmentResponse)
  {
    this.visible = true;

    this.departmentForm.patchValue({
      departmentId: value.id,
      name: value.name,
      description: value.description
    });

  }
  breadcrumbItems: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/admin' },
    { label: 'Departments' }
  ];
}
