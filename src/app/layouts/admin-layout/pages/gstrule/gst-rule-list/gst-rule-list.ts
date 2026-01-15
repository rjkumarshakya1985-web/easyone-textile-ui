import { Component, signal } from '@angular/core';
import { GstRuleDto } from '../../../../../model/response/gstrule/gstrule-response.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderService } from '../../../../../core/services/loader.service';
import { GstRuleService } from '../../../../../core/services/gstrule-service';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { Observable } from 'rxjs';
import { StockGroup } from '../../../../../model/stock-group.model';
import { StockGroupService } from '../../../../../core/services/stock-group.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-gst-rule-list',
  imports: [CommonModule,
    PanelModule,
    ButtonGroupModule,
    TableModule,
    CardModule,
    ButtonModule,ToolbarModule,
    BreadcrumbModule,
    ReactiveFormsModule,
    DialogModule,
    FloatLabelModule,
    SelectModule,InputNumberModule],
  templateUrl: './gst-rule-list.html',
  styleUrl: './gst-rule-list.css',
})
export class GstRuleList {

  isLoading = signal(false);
  tableData = signal<GstRuleDto[]>([]);   // <-- FIXED
  visible = false;
  stockGroup$!: Observable<StockGroup[]>;
  gstRuleForm!: FormGroup;
  isEdit:boolean = false;
   constructor(private fb: FormBuilder,
    private loader: LoaderService,private gstRuleService:GstRuleService,
    private stockGroupService:StockGroupService,private messageService: MessageService) {

      this.gstRuleForm = this.fb.group({
       id:[null],
       stockGroupId:[null, Validators.required],
       gstValue:[null, Validators.required],
       startRange:[null, Validators.required],
       endRange: [null]
      });

      this.loadGstRules();    // <-- Auto-load list
  }


   loadGstRules()
   {
     this.stockGroup$ = this.stockGroupService.getAll();
     this.isLoading.set(false);

     this.gstRuleService.getAll().subscribe({
      next: res => {
        this.tableData.set(res);
      },
      complete: () => {
        this.isLoading.set(true);
      }
    });
   }

   showDialog() {

    this.gstRuleForm = this.fb.group({
       id:[null],
       stockGroupId:[null, Validators.required],
       gstValue:[null, Validators.required],
       startRange:[null, Validators.required],
       endRange: [null]
      });

    this.visible = true;
    this.isEdit = false;
  }
  
  edit(data:GstRuleDto)
  {
      this.gstRuleForm = this.fb.group({
       id:[data.id],
       stockGroupId:[data.stockGroupId, Validators.required],
       gstValue:[data.gstValue, Validators.required],
       startRange:[data.startRange, Validators.required],
       endRange: [data.endRange]
      });

      this.visible = true;
      this.isEdit = true;
  }
  saveGstRule(){
     if (this.gstRuleForm.invalid) {
      this.gstRuleForm.markAllAsTouched();
      return;
    }
    this.loader.show();
    const gstRuleData = this.gstRuleForm.value;

    if(this.isEdit)
    {
      this.gstRuleService.edit(gstRuleData).subscribe({
        next: res => {
              this.visible = false;
              this.gstRuleForm.reset();

              this.messageService.add({
                   severity: 'success',
                   summary: 'Success',
                   detail: 'Gst Rule update successfully!'
              });
              this.loader.hide();
              this.loadGstRules(); 
        },
        error: err => {
        console.error('Error:', err);
        alert('Error creating gst rule');
      }
      });
    }
    else
    {
      this.gstRuleService.create(gstRuleData).subscribe({
        next: res => {
              this.visible = false;
              this.gstRuleForm.reset();

              this.messageService.add({
                   severity: 'success',
                   summary: 'Success',
                   detail: 'Gst Rule create successfully!'
              });
              this.loader.hide();
              this.loadGstRules(); 
        },
        error: err => {
        console.error('Error:', err);
        alert('Error creating gst rule');
      }
      });
   }
  }


   breadcrumbItems: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/admin' },
    { label: 'Gst Rule' }
  ];
}
