import { Component ,OnInit} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterDataService } from '../../../../../core/services/master-data-service';
import { LoaderService } from '../../../../../core/services/loader.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { State } from '../../../../../model/state.model';
import { City } from '../../../../../model/city.model';
import {finalize, Observable } from 'rxjs';
import { CustomerService } from '../../../../../core/services/customer-service';

@Component({
  selector: 'app-add-customer',
  imports: [CommonModule, ReactiveFormsModule, InputNumberModule,
    InputTextModule, SelectModule , ButtonModule, CardModule,
     TextareaModule, FloatLabelModule,ToastModule],
  templateUrl: './add-customer.html',
  styleUrl: './add-customer.css',
})
export class AddCustomer implements OnInit {
   isEdit = false; 
  CustomerId!: string;
  states$!: Observable<State[]>;
  cities$!: Observable<City[]>; 
  customerForm!: FormGroup;


  // Dropdown data
  registrationTypes = [
    { name: 'Regular', value: 1 },
    { name: 'Composition', value: 2 },
    { name: 'Unregistered', value: 3 }
  ];

  customerTypes = [
    { name: 'WholeSaler', value: 1 },
    { name: 'Retailer', value: 2 }
  ];

  discountTypes = [{ name: '%', value: 1 },
    { name: 'MU', value: 2 }
  ];

  transactionTypes = [
    { name: 'e-Fund Transfer', value: 1 },
    { name: 'Cheque', value: 2 },
    { name: 'Others', value: 3 }
  ]; // Dynamic table (replace with service)


  constructor(private fb: FormBuilder,
    private router: Router,
    private customerService:CustomerService,
    private masterService: MasterDataService,
    private loader: LoaderService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {
      // this.loadDropdowns();
      // this.initForm();
  }
ngOnInit(): void {  
   this.initForm();
  this.loadDropdowns();
 // this.loadSupplierCode();
  this.checkEditMode();
  }
  initForm()
    {
      this.customerForm = this.fb.group({
       id: [null], // instead of 0
       customerType: [null,Validators.required],
       name: ['', Validators.required],
       alias: [''],
       ledgerName: [''],
       printName: ['',Validators.required],
       groupName: [''],
       gstIn: ['',Validators.required],
       pan: ['',Validators.required],
       regType: [null,Validators.required],
       billingAddress: [''],
       shippingAddress: [''],
       cityId: [null,Validators.required],
       stateId:[null,Validators.required],  
       pinCode: ['',Validators.required],
       phone: [''],
       mobile: ['',Validators.required],
       email: [''],
       contactPerson: [''],
       openingBalance: [null],
       creditDays: [null,Validators.required],
       creditLimit: [null,Validators.required],
       priceLevel: [null],       // changed from ''
       tallyLedgerType: [null],      // changed from ''
       tallyCategory: [null], // changed from ''
       remarks: ['']
      });

       this.customerForm.get('name')?.valueChanges.subscribe(value => {
           this.customerForm.get('printName')?.setValue(value, { emitEvent: false });
           this.customerForm.get('ledgerName')?.setValue(value, { emitEvent: false });
           this.customerForm.get('groupName')?.setValue(value, { emitEvent: false });
           this.customerForm.get('alias')?.setValue(value, { emitEvent: false });
      });
  
    }
 checkEditMode() {
    this.CustomerId = this.route.snapshot.paramMap.get('id')!;
    if (this.CustomerId) {
      this.isEdit = true;
      this.loadCustomerForEdit();
    } 
  }
    loadCustomerForEdit() {
    this.loader.show();
    this.customerService.getCustomer(this.CustomerId)
      .pipe(finalize(() => this.loader.hide()))
      .subscribe({
        next: customer => {
          
          this.customerForm.patchValue(customer);

          // Load subDepartments & cities based on existing values
          // if (customer.customerType) {
          //   this.subDepartment$ = this.masterService.getSubDepartments(customer.departmentId);
          // }
          if (customer.stateId) {
            this.cities$ = this.masterService.getCitiesByStateId(customer.stateId);
          }
          this.customerForm.get('userName')?.disable();
          this.customerForm.get('code')?.disable();
        },
       error: err => {
        console.error('Error loading customer', err);
        this.router.navigate(['admin/not-found'])
     }
      });
  }

   

    loadDropdowns() {
     this.states$ = this.masterService.getStates();
    }

  onStateChange(event: any) {  
    const stateId = event.value;
    this.cities$ = this.masterService.getCitiesByStateId(stateId);
    this.customerForm.patchValue({ cityId: '' });
  }
  submit(){
   
       if (this.customerForm.invalid) {
          this.customerForm.markAllAsTouched();
          return;
       }
   let request = this.customerForm.value;
   request.id=this.CustomerId;
  this.loader.show();   
     if(!this.CustomerId)
        {   
    this.customerService.create(request)
    .pipe(finalize(() => this.loader.hide())) 
    .subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Customer saved successfully!'
        });      
 if(this.CustomerId)
        {
          setTimeout(() => {
            this.router.navigate(['admin/customers']);
          }, 1000);
        }
        else
        {
        this.customerForm.reset();
        }
      
      }
    
  });
      
}
else
{
   this.customerService.update(this.CustomerId,request)
    .pipe(finalize(() => this.loader.hide())) 
    .subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Customer updated successfully!'
        });      
 if(this.CustomerId)
        {
          setTimeout(() => {
            this.router.navigate(['admin/customers']);
          }, 1000);
        }
        else
        {
        this.customerForm.reset();
        }
      
      }
    
  });
}
}
}
