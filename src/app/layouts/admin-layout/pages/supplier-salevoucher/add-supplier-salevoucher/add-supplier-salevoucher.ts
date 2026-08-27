
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
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
import { finalize, Observable, tap } from 'rxjs';
import { SupplierService } from '../../../../../core/services/supplier-service';
import { StockGroup } from '../../../../../model/stock-group.model';
import { AutoCompleteService } from '../../../../../core/services/auto-complete-service';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { Supplier } from '../../../../../model/supplier.model';
import { SaleVoucherDetail } from '../../../../../model/salevoucher-detail.model';
import { SupplierProductView } from '../../../../../model/views/supplier-product-view.model';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SaleVoucherService } from '../../../../../core/services/salevoucher.service';
import { SaleVoucherRequest } from '../../../../../model/request/salevouchers/salevoucher-request.model';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../../../core/services/loader.service';

import { Menu, MenuModule } from 'primeng/menu';
import { SupplierTableResponse } from '../../../../../model/response/supplier/supplier-table-response.model';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { AddSupplierProduct } from '../../products/add-product/add-product';


@Component({
  selector: 'app-add-supplier-salevoucher',
  standalone: true,
  providers: [ConfirmationService],  
  imports: [ CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputNumberModule, 
    DatePickerModule,
    SelectModule,
    ButtonModule,
    CardModule,
    TableModule,
    ToolbarModule,
    DialogModule,FloatLabelModule,AutoCompleteModule,ConfirmDialogModule,
    CheckboxModule,
    MenuModule,    
    InputTextModule,       
    TextareaModule,
    ToastModule,
    AddSupplierProduct 
  ],
 templateUrl: './add-supplier-salevoucher.html',
  styleUrl: './add-supplier-salevoucher.css',
})
export class AddSupplierSalevoucher {
  @ViewChild('menu') menu!: Menu;
  items: MenuItem[] = [];
  checkAll:boolean=false;
  editQty:number=0
  editVoucherDetail?: SaleVoucherDetail;
  isEdit = false;
  saleVoucherId!:number;
  visible = false;
  isSaleVoucherQtyPopupVisible =false;
  voucherForm!: FormGroup;
  productForm!: FormGroup;
  transports$!: Observable<Transport[]>;
  stockGroup$!: Observable<StockGroup[]>;
  filteredProducts = signal<SupplierProductView[]>([]);
  saleVouherDetail = signal<SaleVoucherDetail[]>([]);
  stockGroups = signal<StockGroup[]>([]);
  supplier!:Supplier;
  filteredSuppliers = signal<SupplierTableResponse[]>([]);
  transports = [
    { id: 'T1', name: 'Blue Dart' },
    { id: 'T2', name: 'DTDC' },
    { id: 'T3', name: 'Professional Couriers' }
  ];

  statuses = [
    { label: 'InTransit', value: 3 },
    { label: 'Transport', value: 4 },
    { label: 'Packed At Location', value: 5 },
    { label: 'Cancelled', value: 9 },
  ];

  products = [
    { group: 'Electronics', product: 'Charger', salePrice: 200, purchasePrice: 150, quantity: 2 },
    { group: 'Home', product: 'Broom', salePrice: 60, purchasePrice: 40, quantity: 5 }
  ];

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private autocompleteService:AutoCompleteService,
    private messageService:MessageService,
    private confirmationService: ConfirmationService,
    private saleVoucherService: SaleVoucherService,
    private loader: LoaderService,
    private supplierService:SupplierService,
    ) {
      
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
       description: [''],
       additionalCharges:[0,Validators.required],
       supplierObj:[null,Validators.required]
    });
    
    this.productForm = this.fb.group({
      selectproduct: [null, Validators.required],
      quantity: [null, Validators.required],
      productId: [null],
      isSupplierDiscount:[true,Validators.required]
    });

  // Reset selectproduct and productId when stockGroupId changes
  const input = document.getElementById('supplierBillNumber') as HTMLInputElement;
    if (input) {
     input.focus(); // Focus the input
    }
   }

  checkEditMode() {
    const idParam = this.route.snapshot.paramMap.get('id');
     console.log(idParam);
     const parsedId = idParam ? Number(idParam) : null;
    if (parsedId !== null && !isNaN(parsedId)) {
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
          description: salevoucher.remarks,
          additionalCharges:salevoucher.additionalCharges,
          supplierObj:salevoucher.supplierObj
        });

        // ✅ Map details
        const list: SaleVoucherDetail[] = salevoucher.details.map(detail => ({
          id:detail.id,
          stockGroupId: detail.categoryId,
          stockGroupName: detail.categoryName,
          productId: detail.productId,
          productName: detail.productName,
          qty: detail.quantity,
          purchasePrice: detail.purchasePrice,
          wholeSalePrice: detail.wholeSalePrice,
          retailPrice: detail.retailPrice,
          mrpPrice: detail.mrpPrice,
          isSupplierDiscount:detail.isSupplierDiscount
        }));
        this.saleVouherDetail.set(list);
        this.onSupplierSelect({ value: salevoucher.supplierObj });
      },
      error: err => {
        console.error('Error loading supplier', err);
        this.router.navigate(['admin/not-found']);
      }
    });
 }

  onCheckAll()
  {
      this.saleVouherDetail.update(items =>
        items.map(item => ({
          ...item,
          isSupplierDiscount: this.checkAll
        }))
     );
  }

  
  removeProduct(row: any) {
    this.products = this.products.filter(p => p !== row);
  }

   showDialog(): void {
       const supplierId = this.voucherForm.value.supplierObj?.id;
       if(supplierId)
      this.visible=true;
   }

   getSupplierId()
   {
    return this.voucherForm.value.supplierObj?.id
   }

  searchProduct(event: AutoCompleteCompleteEvent) {
    const query = event.query;
   

    if (!query || query.length < 2) {
     this.filteredProducts.set([]);
     return;
    }
    
    const supplierId = this.voucherForm.value.supplierObj?.id;

    if (!supplierId) {
    this.filteredProducts.set([]);
    return;
  }
    this.autocompleteService
     .searchSupplierProduct(query,supplierId)
     .subscribe(res => {
      this.filteredProducts.set(res);
    });
   
  }
   
 addProductToSaleVoucher() {

  if (this.productForm.invalid) {
    this.productForm.markAllAsTouched();
    return;
  }

  const quantity = this.productForm.get('quantity')?.value as number;
  const discount = this.productForm.get('isSupplierDiscount')?.value as boolean;
  const addProduct = this.productForm.get('selectproduct')?.value as SupplierProductView;

  let isUpdated = false;

  this.saleVouherDetail.update(items => {

    const index = items.findIndex(
      x =>  x.productId === addProduct.id
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
      stockGroupId: addProduct.stockGroupId,
      stockGroupName: addProduct?.stockGroupName ?? '',
      productId: addProduct.id,
      productName: addProduct.name,
      purchasePrice: addProduct.purchaseRate,
      qty: quantity,
      wholeSalePrice: addProduct.wholeSaleRate ?? 0,
      retailPrice: addProduct.retailPrice ?? 0,
      mrpPrice: addProduct.mrpRate ?? 0,
      isSupplierDiscount: discount
    };

    return [...items, detail];
  });

  // ✅ Reset form (keep stock group selected)
  this.productForm.patchValue({
    selectproduct: null,
    quantity: null
  });
   
  const input = document.getElementById('selectproduct') as HTMLInputElement;
  if (input) {
    input.focus(); // Focus the input
  }
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

 printItem(index:number)
 {
   const item = this.saleVouherDetail()[index];
  
   this.router.navigate(
     ['/supplier/sticker-print', item.id],
     { queryParams: { isSaleVoucher: true } }
   );
  
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
  const supplierSelected = this.voucherForm.value.supplierObj as SupplierTableResponse;
  

  const d = new Date(formValue.date);

  const formattedDate = `${d.getFullYear()}-${(d.getMonth()+1)
  .toString().padStart(2,'0')}-${d.getDate()
  .toString().padStart(2,'0')}`;

  const request: SaleVoucherRequest = {
    id:this.saleVoucherId,
    transportId: formValue.transportId,
    date: formattedDate,
    numberOfParcel: formValue.numberOfPacket,
    supplierBillNumber: formValue.supplierBillNumber,
    status: formValue.status,
    remarks: formValue.description,
    supplierId:supplierSelected.id,
    isActive: true,
    additionalCharges:formValue.additionalCharges,
    saleVoucherDetails: this.saleVouherDetail().map(item => ({
      productId: item.productId,
      quantity: item.qty,
      IsSupplierDiscount:item.isSupplierDiscount
    }))
  };
  
  //  update when edit
 if (this.isEdit) {
  this.saleVoucherService.update(request).subscribe(id => {
    if (id) {
      this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Sale voucher updated successfully' });
      this.router.navigate(['supplier/print', id]);  
    }
  });
} else {
  this.saleVoucherService.create(request).subscribe(id => {
    if (id) {
      this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Sale voucher created successfully' });
      this.router.navigate(['supplier/print', id]);  
    }
  });
}


 }

 openQtyPopup(row: SaleVoucherDetail)
 {
   this.editVoucherDetail = row;
   this.editQty= row.qty;
   this.isSaleVoucherQtyPopupVisible = true;
 }

 saveQuantityChange()
 {
   if(this.editVoucherDetail){
    this.editVoucherDetail.qty = this.editQty;
    this.isSaleVoucherQtyPopupVisible =false;

   }
 }

openMenu(event: Event, row: SaleVoucherDetail, index: number) {

  this.items = [
      ...(row.id ? [{
        label: 'Print',
        icon: 'pi pi-print',
        command: () => this.printItem(index)
      }] : []),
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => this.openQtyPopup(row)
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => this.removeItem(index)
    }
  ];
   this.menu.toggle(event); // ✅ Always defined
}

 cancel()
 {
    this.router.navigate(['admin/supplier-salevoucher']);     
 }

  onSupplierSelect(event: any) {
    if(event==null) return;
      const supplierId = event.value.id;
   
    this.transports$ = this.supplierService.getSupplierTransport(supplierId)
    .pipe(tap(list => {
      const control = this.voucherForm.get('transportId');

      
      if (list.length >0 && !control?.value) {
        control?.setValue(list[0].id);
      }
    })
    );
    
  }

   searchSupplier(event: any) {
  
    const query = event.query;
    
    this.autocompleteService.searchSupplier(query).subscribe(res => {
      this.filteredSuppliers.set(res); 
    });
  }

  addNewSupplier()
  {
    this.router.navigate(['admin/supplier/add']);
  }
} 
