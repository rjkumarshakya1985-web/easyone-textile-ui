
import { AfterViewInit, Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule  } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TextareaModule  } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { StockGroup } from '../../../../../model/stock-group.model';
import { finalize, Observable, tap } from 'rxjs';
import { StockGroupService } from '../../../../../core/services/stock-group.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { LoaderService } from '../../../../../core/services/loader.service';
import { SupplierProductService } from '../../../../../core/services/supplier-product-service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductHsnCode } from '../../../../../model/response/hsn-code.model';
import { AutoCompleteService } from '../../../../../core/services/auto-complete-service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Gsts } from '../../../../../model/views/gsts-view.model';
import { MasterDataService } from '../../../../../core/services/master-data-service';
import { SupplierService } from '../../../../../core/services/supplier-service';
import { SupplierTableResponse } from '../../../../../model/response/supplier/supplier-table-response.model';

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
export class AddProduct implements OnInit, AfterViewInit {
  isEdit = false;
   @ViewChild('productNameInput')
  productNameInput!: ElementRef<HTMLInputElement>;
  stockGroup$!: Observable<StockGroup[]>;
  
  gst$!:Observable<Gsts[]>;
  productForm!: FormGroup;
  productId!: string;
  selectedHsnCode: any = null;
  filteredHsnCodes = signal<ProductHsnCode[]>([]);
  filteredSuppliers = signal<SupplierTableResponse[]>([]);
  stockGroupList: StockGroup[] = [];

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
    private supplierService :SupplierService,
    private supplierProductService: SupplierProductService,
    private loader: LoaderService,
    private autocompleteService:AutoCompleteService,
    private masterDataService:MasterDataService) {}

  ngOnInit(): void {
    
    this.initForm();
     this.gst$ = this.masterDataService.getGsts();
    this.checkEditMode();
    this.loadDropdowns();

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
      discount:[null,Validators.required],
      purchaseRate:[null,Validators.required],
      manualWholeSaleRate:[null],
      supId: [''],
      supplierObj:[null,Validators.required]
    });

    this.productForm.get('name')?.valueChanges.subscribe(value => {
    this.productForm.get('printName')?.setValue(value, { emitEvent: false });
    this.productForm.get('alias')?.setValue(value, { emitEvent: false });
    });

    this.productForm.get('purchaseRate')?.valueChanges.subscribe(rate => {
    if (rate == null) return;

    const stockGroupId = this.productForm.get('stockGroupId')?.value;
    const selectedGroup = this.stockGroupList.find(x => x.id === stockGroupId);

    if (selectedGroup?.isGstRule) {
      this.applyGstFromSlab(selectedGroup);
    }
   });
  }

  loadDropdowns() {
     
  
   
  }

  checkEditMode() {
     let id = this.route.snapshot.paramMap.get('id')!;

    if (id && isNaN(Number(id))) {
      
      this.productId= id;
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
          this.onSupplierSelect({ value: product.supplierObj });
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
const supplierSelected = this.productForm.value.supplierObj as SupplierTableResponse;
  
  const request = {
    ...this.productForm.value,
    hsnCode: hsnSelected?.name,  
    id: this.productId,
    supplierId: supplierSelected.id
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
          this.router.navigate(['admin/supplier-products']);
        } else {
         
           setTimeout(() => {
               this.initForm();
               this.isEdit = false;          
               this.loadDropdowns();         
               this.checkEditMode();
                this.productNameInput?.nativeElement.focus();
           }, 300);
          
           
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

 /// CalCulate Gst
 onStockGroupSelect(event: any) {
  const selectedId = event.value;
  this.onCategoryChange(selectedId);
  const selectedGroup = this.stockGroupList.find(
    x => x.id === selectedId
  );


  if (!selectedGroup) return;

  if (selectedGroup.isGstRule === false) {
    this.productForm.get('discount')?.setValue(selectedGroup.gstValue);
  } else {
     this.applyGstFromSlab(selectedGroup);
  }
}

applyGstFromSlab(selectedGroup: any) {
  const rate = this.productForm.get('purchaseRate')?.value;

  if (rate == null || !selectedGroup?.gstRuleDtos?.length) {
    this.productForm.get('discount')?.reset();
    return;
  }

  const matchedRule = selectedGroup.gstRuleDtos.find((rule: any) => {
    const start = rule.startRange ?? 0;
    const end = rule.endRange ?? Number.MAX_SAFE_INTEGER;

    return rate >= start && rate <= end;
  });

  if (matchedRule) {
    this.productForm.get('discount')?.setValue(matchedRule.gstValue);
  } else {
    this.productForm.get('discount')?.reset();
  }
}

/// Get hsn code by stock group

onCategoryChange(stockGroupId:number)
{
  this.loader.show();
  const supplierControl = this.productForm.get('supplierObj');
  const supplierId = supplierControl?.value?.id; // assuming object {id,name}
  this.supplierService.getGetSupplierHsnCodes(stockGroupId,supplierId).subscribe(response=>{

       this.loader.hide();
       const control = this.productForm.get('hsnCodeObj');
       if (response.length > 0) {
              control?.setValue(response[0]);
       }
       else{
          control?.setValue(null);
       }
  })
}

  cancel() {
    this.productForm.reset();
  }

  ngAfterViewInit(): void {
    // Small timeout to ensure PrimeNG renders fully
    setTimeout(() => {
      this.productNameInput?.nativeElement.focus();
    }, 0);
  }

   onSupplierSelect(event: any) {
    if(event==null) return;
      const supplierId = event.value.id;
      this.stockGroup$ = this.supplierService.getSupplierStockGroups(supplierId)
    .pipe(
      tap(list => {
        this.stockGroupList = list; 
          if(!this.isEdit)
          {
           const control = this.productForm.get('stockGroupId');
             
            if (list.length > 0 && !control?.value) {
              control?.setValue(list[0].id);
              this.onCategoryChange(list[0].id);
            }

           const controlDiscount = this.productForm.get('discount');
            if (list.length > 0 && !controlDiscount?.value) {
              
             if(!list[0].isGstRule)
             {
              controlDiscount?.setValue(list[0].gstValue);
             }
           }

          }
      })
    );

  }

   searchSupplier(event: any) {
  
    const query = event.query;
     this.filteredHsnCodes.set([]);
     this.selectedHsnCode=null;

    this.autocompleteService.searchSupplier(query).subscribe(res => {
      this.filteredSuppliers.set(res); 
    });
 }
}
