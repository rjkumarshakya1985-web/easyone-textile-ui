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
import { SubDepartmentResponse } from '../../../../../model/response/sub-department/sub-department.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FloatLabelModule } from 'primeng/floatlabel';
import { LoaderService } from '../../../../../core/services/loader.service';

@Component({
  selector: 'app-sub-department-list',
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
  templateUrl: './subdepartment-list.html',
  styleUrl: './subdepartment-list.css',
})
export class SubdepartmentList {

  departmentId: number = 0;
  isLoading = signal(false);
  tableData = signal<SubDepartmentResponse[]>([]);

  visible = false;
  subDepartmentForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private masterService: MasterDataService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private loader: LoaderService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.departmentId = id;

      this.subDepartmentForm = this.fb.group({
        departmentId: [id],
        subDepartmentId: [0],  // number null
        name: ['', Validators.required],
        description: ['']
      });

      this.loadSubDepartments();
    }
  }

  loadSubDepartments() {
    this.isLoading.set(false);
    this.masterService.getSubDepartments(this.departmentId).subscribe({
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
    this.subDepartmentForm.reset({
      departmentId: this.departmentId,
      subDepartmentId: 0,
      name: '',
      description: ''
    });
  }

  saveSubDepartment() {
    if (this.subDepartmentForm.invalid) {
      this.subDepartmentForm.markAllAsTouched();
      return;
    }

    const data = this.subDepartmentForm.value;
     this.loader.show();
    this.masterService.saveSubDepartment(data).subscribe({
      next: res => {
        if (res) {
          this.visible = false;
          this.subDepartmentForm.reset();
            this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Supplier saved successfully!'
          });
          this.loader.hide();
          this.loadSubDepartments();
        } else {
          alert('Something went wrong');
        }
      },
      error: err => {
        console.error('Error:', err);
        alert('Error saving sub-department');
      }
    });
  }

  editSubDepartment(value: SubDepartmentResponse) {
    this.visible = true;

    this.subDepartmentForm.patchValue({
      departmentId: this.departmentId,
      subDepartmentId: value.id,
      name: value.name,
      description: value.description
    });
  }

  breadcrumbItems: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/admin' },
    { label: 'Departments', routerLink: '/admin/departments' },
    { label: 'Sub Departments' }
  ];
}
