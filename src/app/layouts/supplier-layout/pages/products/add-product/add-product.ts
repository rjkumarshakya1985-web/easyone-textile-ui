

import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule  } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TextareaModule  } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { StockGroup } from '../../../../../model/stock-group.model';
import { finalize, Observable } from 'rxjs';
import { StockGroupService } from '../../../../../core/services/stock-group.service';
import { FloatLabel, FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { LoaderService } from '../../../../../core/services/loader.service';
import { SupplierProductService } from '../../../../../core/services/supplier-product-service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductHsnCode } from '../../../../../model/response/hsn-code.model';
import { AutoCompleteService } from '../../../../../core/services/auto-complete-service';
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule,
            ReactiveFormsModule,
            InputTextModule,
            SelectModule,
            ButtonModule,
            CardModule,
            TextareaModule,
            FormsModule,
            InputNumberModule,
            FloatLabelModule,ToastModule,AutoCompleteModule  
  ],
  templateUrl: './add-product.html',
  styleUrls: ['./add-product.css']
})
export class AddProduct implements OnInit {
  isEdit = false;
  stockGroup$!: Observable<StockGroup[]>;
  productForm!: FormGroup;
  productId!: string;
  selectedHsnCode: any = null;
  filteredHsnCodes = signal<ProductHsnCode[]>([]);

  registrationTypes = [
    { label: 'Regular', value: 'Regular' },
    { label: 'Composition', value: 'Composition' },
    { label: 'Unregistered', value: 'Unregistered' }
  ];

  gstOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
  ];

  gstNatureOptions = [
    { label: 'Goods', value: 1 },
    { label: 'Services', value: 2 }
  ];

  gstTaxabilityOptions = [
    { label: 'Taxable', value: 1 },
    { label: 'Exempt', value: 2 },
    { label: 'NilRated', value: 3 }
  ];


  constructor(private fb: FormBuilder,private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private supplierProductService: SupplierProductService,
    private stockGroupService:StockGroupService,
    private loader: LoaderService,
    private autocompleteService:AutoCompleteService) {}

  ngOnInit(): void {
    
    this.initForm();
    this.loadDropdowns();
    this.checkEditMode();
  
  }

  initForm()
  {
    this.productForm = this.fb.group({
      id: [null],
      stockGroupId:[null, Validators.required],
      name: ['', Validators.required],
      alias: [''],
      printName: ['',Validators.required],
      hsnCode: [''],
      hsnCodeObj:[null,Validators.required],
      barcode: ['',Validators.required],
      gstApplicable: [true],
      gstNature: [1],
      gstTaxability: [1],
      discount:[0,Validators.required],
      purchaseRate:[null,Validators.required],
      supId: ['']
    });
  }

  loadDropdowns() {
    this.stockGroup$ = this.stockGroupService.getAll();
  }

  checkEditMode() {
    this.productId = this.route.snapshot.paramMap.get('id')!;

    if (this.productId) {
      this.isEdit = true;
      this.loadProductForEdit();
    }
    else
      {
        this.supplierProductService.getCode().subscribe(result=>{
          this.productForm.patchValue({ barcode: result?.data });
        })
      } 
  }

  loadProductForEdit() {
    this.loader.show();
    this.supplierProductService.getById(this.productId)
      .pipe(finalize(() => this.loader.hide()))
      .subscribe({
        next: product => {
          this.productForm.patchValue(product);
        },
       error: err => {
        console.error('Error loading supplier', err);
        this.router.navigate(['admin/not-found'])
     }
      });
  }

  submit() {
  if (this.productForm.invalid) {
    this.productForm.markAllAsTouched();
    return;
  }

 
 const hsnSelected = this.productForm.value.hsnCodeObj as ProductHsnCode;

  
  const request = {
    ...this.productForm.value,
    hsnCode: hsnSelected?.name,  
    id: this.productId
  };

  this.loader.show();

  const apiCall$ = this.productId
    ? this.supplierProductService.update(request)   // ✅ UPDATE
    : this.supplierProductService.create(request);  // ✅ CREATE
  apiCall$
    .pipe(finalize(() => this.loader.hide()))
    .subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.productId
            ? 'Product updated successfully!'
            : 'Product created successfully!'
        });

        if (this.productId) {
          // Navigate after update
          this.router.navigate(['supplier/products']);
        } else {
          // Reset form after create
          this.initForm();
          this.checkEditMode();
        }
      }
    });
}


searchHsnCode(event: any) {
  
  const query = event.query;
 
   this.autocompleteService.searchHsnCode(query).subscribe(res => {
     this.filteredHsnCodes.set(res); 
   });
 }

  cancel() {
    this.productForm.reset();
  }
}
