import { Component, signal, ViewChild } from '@angular/core';
import { StockGroup } from '../../../../../model/stock-group.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StockGroupService } from '../../../../../core/services/stock-group.service';
import { MenuItem, MessageService } from 'primeng/api';
import { LoaderService } from '../../../../../core/services/loader.service';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Menu, MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-item-category-list',
  standalone: true,
  imports: [ CommonModule,
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
    InputNumberModule,   
    InputTextModule,    
    TextareaModule,       
    FloatLabelModule,CheckboxModule,MenuModule],
  templateUrl: './item-category-list.html',
  styleUrl: './item-category-list.css',
})
export class ItemCategoryList {
  visible = false;
  isLoading = signal(false);
  tableData = signal<StockGroup[]>([]);  
  stockGroupForm!: FormGroup;
  items: MenuItem[] = [];
  @ViewChild('menu') menu!: Menu;
  breadcrumbItems: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/admin' },
    { label: 'Product Categories' }
  ];
  
  constructor(private fb: FormBuilder,
    private stockGroupService: StockGroupService,
    private messageService: MessageService,
    private loader: LoaderService) {

   this.stockGroupForm = this.fb.group({
     id: [null],
     name: ['', Validators.required],
     gstValue: [0, [Validators.required, Validators.min(0)]],
     isGstRule: [true],
     description: [''],
     isActive: [true]
    });

    this.loadStockGroup();    // <-- Auto-load list
  }
  
  loadStockGroup() {
    this.isLoading.set(false);

    this.stockGroupService.getAll().subscribe({
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
      this.stockGroupForm.reset({
      id: null,
      name: '',
      gstValue: 0,
      isGstRule: true,
      description: '',
      isActive: true
    });
  }

  editStockGroup(value: StockGroup) {
   this.visible = true;

   this.stockGroupForm.patchValue({
    id: value.id,
    name: value.name,
    gstValue: value.gstValue,
    isGstRule: value.isGstRule,
    description: value.description,
    isActive: value.isActive
   });
}

 saveStockGroup() {
  
   if (this.stockGroupForm.invalid) {
    this.stockGroupForm.markAllAsTouched();
    return;
   }

   const payload = this.stockGroupForm.value;

   this.loader.show();

   const request$ = payload.id
    ? this.stockGroupService.update(payload)   // UPDATE
    : this.stockGroupService.create(payload);  // CREATE

    request$.subscribe({
      next: () => {
        this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: payload.id
          ? 'Stock Group updated successfully'
          : 'Stock Group created successfully'
      });

      this.visible = false;
      this.stockGroupForm.reset({
        id: null,
        gstValue: 0,
        isGstRule: true,
        isActive: true
      });

      this.loadStockGroup(); // refresh table
    },
    error: () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Something went wrong. Please try again.'
      });
    },
    complete: () => {
      this.loader.hide();
    }
  });
 }

 makeGstRule(row :StockGroup)
 {

 }

 openMenu(event: Event, row: StockGroup) {
  this.items = [
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => this.editStockGroup(row)
    },
    {
      label: 'GST Rule',
      icon: 'pi pi-file',
      command: () => this.makeGstRule(row)
    }
  ];

  this.menu.toggle(event);
 }
}
