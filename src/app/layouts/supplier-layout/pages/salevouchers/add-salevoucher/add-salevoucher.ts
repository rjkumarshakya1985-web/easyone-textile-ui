import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// PrimeNG Modules
import { DatePickerModule  } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { Transport } from '../../../../../model/transporter.model';
import { finalize, Observable } from 'rxjs';
import { SupplierService } from '../../../../../core/services/supplier-service';
import { StockGroup } from '../../../../../model/stock-group.model';
import { StockGroupService } from '../../../../../core/services/stock-group.service';;
import { AutoCompleteService } from '../../../../../core/services/auto-complete-service';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { Supplier } from '../../../../../model/supplier.model';
import { SaleVoucherDetail } from '../../../../../model/salevoucher-detail.model';
import { SupplierProductView } from '../../../../../model/views/supplier-product-view.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SaleVoucherService } from '../../../../../core/services/salevoucher.service';
import { SaleVoucherRequest } from '../../../../../model/request/salevouchers/salevoucher-request.model';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../../../core/services/loader.service';


@Component({
  selector: 'app-add-salevoucher',
  standalone: true,
  providers: [ConfirmationService],  
  imports: [ CommonModule,
    ReactiveFormsModule,
    
    // PrimeNG modules
    InputNumberModule, 
    DatePickerModule,
    SelectModule,
    ButtonModule,
    CardModule,
    TableModule,
    ToolbarModule,
    DialogModule,FloatLabelModule,AutoCompleteModule,ConfirmDialogModule],
  templateUrl: './add-salevoucher.html',
  styleUrl: './add-salevoucher.css',
})
export class AddSalevoucher {
  isEdit = false;
  saleVoucherId!:number;
  visible = false;
  voucherForm!: FormGroup;
  productForm!: FormGroup;
  transports$!: Observable<Transport[]>;
  stockGroup$!: Observable<StockGroup[]>;
  filteredProducts = signal<SupplierProductView[]>([]);
  saleVouherDetail = signal<SaleVoucherDetail[]>([]);
  stockGroups = signal<StockGroup[]>([]);
  supplier!:Supplier;
  transports = [
    { id: 'T1', name: 'Blue Dart' },
    { id: 'T2', name: 'DTDC' },
    { id: 'T3', name: 'Professional Couriers' }
  ];

  statuses = [
    { label: 'InTransit', value: 3 },
  ];

  products = [
    { group: 'Electronics', product: 'Charger', salePrice: 200, purchasePrice: 150, quantity: 2 },
    { group: 'Home', product: 'Broom', salePrice: 60, purchasePrice: 40, quantity: 5 }
  ];

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private supplierService:SupplierService,
    private stockGroupService:StockGroupService,
    private autoCompleteService:AutoCompleteService,
    private messageService:MessageService,
    private confirmationService: ConfirmationService,
    private saleVoucherService: SaleVoucherService,
    private loader: LoaderService,
    ) {
      this.loadDropDowns();
  }
  

  loadDropDowns()
  {
     this.transports$ = this.supplierService.getSupplierTransport();
     this.stockGroupService.getAll().subscribe(res => {
     this.stockGroups.set(res);
     });
  }

  ngOnInit(): void {
   this.initForm();  
   this.checkEditMode();
  }

  initForm()
   {
  
     this.voucherForm = this.fb.group({
       date: [new Date(),Validators.required],
       transportId: [null,Validators.required],
       status: [3,Validators.required],
       numberOfPacket: [1,Validators.required],
       supplierBillNumber: ['',Validators.required],
       description: ['']
    });
    
    this.productForm = this.fb.group({
      stockGroupId: [null, Validators.required],
      selectproduct: [{ value: null, disabled: true }, Validators.required],
      quantity: [null, Validators.required],
      productId: [null]
    });

  // Reset selectproduct and productId when stockGroupId changes
   this.productForm.get('stockGroupId')?.valueChanges.subscribe(groupId => {
        if (!groupId) {
        // Disable autocomplete if no group selected
        this.productForm.get('selectproduct')?.disable();
        this.productForm.patchValue({ selectproduct: null, productId: null });
        this.filteredProducts.set([]);
      } else {
        // Enable autocomplete when group is selected
        this.productForm.get('selectproduct')?.enable();
        this.productForm.patchValue({ selectproduct: null, productId: null });
        this.filteredProducts.set([]);
      }
    });
   }

  checkEditMode() {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.saleVoucherId = Number(idParam); // convert string → number
      this.isEdit = true;
      this.loadSaleVoucherForEdit();
    }
  }

   loadSaleVoucherForEdit() {
  this.loader.show();

  this.saleVoucherService.get(this.saleVoucherId)
    .pipe(finalize(() => this.loader.hide()))
    .subscribe({
      next: salevoucher => {

        // ✅ Patch form
        this.voucherForm.patchValue({
          date: salevoucher.date ? new Date(salevoucher.date) : null,
          transportId: salevoucher.transportId,
          status: salevoucher.status,
          numberOfPacket: salevoucher.numberOfParcel,
          supplierBillNumber: salevoucher.supplierBillNumber,
          description: salevoucher.remarks
        });

        // ✅ Map details
        const list: SaleVoucherDetail[] = salevoucher.details.map(detail => ({
          stockGroupId: detail.categoryId,
          stockGroupName: detail.categoryName,
          productId: detail.productId,
          productName: detail.productName,
          qty: detail.quantity,
          purchasePrice: detail.purchasePrice,
          wholeSalePrice: detail.wholeSalePrice,
          retailPrice: detail.retailPrice,
          mrpPrice: detail.mrpPrice
        }));

        console.log(list);

        // ✅ SET signal value
        this.saleVouherDetail.set(list);
      },
      error: err => {
        console.error('Error loading supplier', err);
        this.router.navigate(['admin/not-found']);
      }
    });
}



  editProduct(row: any) {
    console.log('Edit:', row);
  }

  removeProduct(row: any) {
    this.products = this.products.filter(p => p !== row);
  }

   showDialog(): void {
    this.visible = true;
    this.productForm.reset();
  }

  searchProduct(event: AutoCompleteCompleteEvent) {
    const query = event.query;
    const groupId = this.productForm.get('stockGroupId')?.value;

    if (!groupId || !query || query.length < 2) {
     this.filteredProducts.set([]);
     return;
    }

    this.autoCompleteService
     .searchSupplierProduct(groupId, query)
     .subscribe(res => {
      this.filteredProducts.set(res);
    });
  }
   
 addProductToSaleVoucher() {

  if (this.productForm.invalid) {
    this.productForm.markAllAsTouched();
    return;
  }

  const stockGroupId = this.productForm.get('stockGroupId')?.value as number;
  const quantity = this.productForm.get('quantity')?.value as number;
  const addProduct = this.productForm.get('selectproduct')?.value as SupplierProductView;

  const stockGroup = this.stockGroups()
    .find(x => x.id === stockGroupId);

  let isUpdated = false;

  this.saleVouherDetail.update(items => {

    const index = items.findIndex(
      x => x.stockGroupId === stockGroupId && x.productId === addProduct.id
    );

    if (index > -1) {
      isUpdated = true;

      const updatedItems = [...items];
      updatedItems[index] = {
        ...updatedItems[index],
        qty: updatedItems[index].qty + quantity
      };
      return updatedItems;
    }

    const detail: SaleVoucherDetail = {
      stockGroupId: stockGroupId,
      stockGroupName: stockGroup?.name ?? '',
      productId: addProduct.id,
      productName: addProduct.name,
      purchasePrice: addProduct.purchaseRate,
      qty: quantity,
      wholeSalePrice: addProduct.wholeSaleRate ?? 0,
      retailPrice: addProduct.retailPrice ?? 0,
      mrpPrice: addProduct.mrpRate ?? 0
    };

    return [...items, detail];
  });

  // ✅ Reset form (keep stock group selected)
  this.productForm.patchValue({
    selectproduct: null,
    quantity: null
  });

  // ✅ Success message
  
}


 removeItem(index: number) {
  const item = this.saleVouherDetail()[index];

  this.confirmationService.confirm({
    message: `Are you sure you want to remove "${item.productName}"?`,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.saleVouherDetail.update(items =>
        items.filter((_, i) => i !== index)
      );
      this.messageService.add({
        severity: 'success',
        summary: 'Deleted',
        detail: `${item.productName} removed successfully`
      });
    },
    reject: () => {
      // Optional: do nothing
    }
  });
}

     
 getTotalQty(): number {
  return this.saleVouherDetail()
    .reduce((sum, x) => sum + (x.qty ?? 0), 0);
}

getTotalWholeSaleAmount(): number {
  return this.saleVouherDetail()
    .reduce((sum, x) => sum + (x.purchasePrice * (x.qty ?? 0)), 0);
}

submit():void
{
 
   if (this.voucherForm.invalid) {
     this.voucherForm.markAllAsTouched();
     return;
   }
 
  if(this.saleVouherDetail().length==0)
  {
    this.messageService.add({
      severity: 'warn',
      summary: 'No Products',
      detail: 'Please add at least one product to the sale voucher'
    });
    return;
  }

  const formValue = this.voucherForm.value;

  const request: SaleVoucherRequest = {
    id:this.saleVoucherId,
    transportId: formValue.transportId,
    date: new Date(formValue.date).toISOString(),
    numberOfParcel: formValue.numberOfPacket,
    supplierBillNumber: formValue.supplierBillNumber,
    status: formValue.status,
    remarks: formValue.description,
    isActive: true,
    saleVoucherDetails: this.saleVouherDetail().map(item => ({
      productId: item.productId,
      quantity: item.qty
    }))
  };
  
  //  update when edit
 if (this.isEdit) {
  this.saleVoucherService.update(request).subscribe(status => {
    if (status) {
      this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Sale voucher updated successfully' });
      this.router.navigate(['supplier/salevouchers']);
    }
  });
} else {
  this.saleVoucherService.create(request).subscribe(status => {
    if (status) {
      this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Sale voucher created successfully' });
      this.router.navigate(['supplier/salevouchers']);
    }
  });
}


 }
}
