import { Component,OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Select, SelectModule  } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TextareaModule  } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DepartmentResponse } from '../../../../../model/response/department/department.model';
import { finalize, Observable } from 'rxjs';
import { MasterDataService } from '../../../../../core/services/master-data-service';
import { SubDepartmentResponse } from '../../../../../model/response/sub-department/sub-department.model';
import { State } from '../../../../../model/state.model';
import { City } from '../../../../../model/city.model';
import { DatePicker } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { SupplierService } from '../../../../../core/services/supplier-service';
import { LoaderService } from '../../../../../core/services/loader.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ActivatedRoute, Router } from '@angular/router';
import { MultiSelectModule } from 'primeng/multiselect';
import { StockGroupService } from '../../../../../core/services/stock-group.service';
import { StockGroup } from '../../../../../model/stock-group.model';
import { LookupDto } from '../../../../../model/views/lookup.model';
import { AgentTableResponse } from '../../../../../model/response/agent/agent-table-response.model';
import { AutoCompleteService } from '../../../../../core/services/auto-complete-service';
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'app-add-supplier',
  imports: [CommonModule, ReactiveFormsModule, InputNumberModule,
    InputTextModule, SelectModule , ButtonModule, CardModule,
     TextareaModule,Select, FloatLabelModule,DatePicker,ToastModule
     ,MultiSelectModule,AutoCompleteModule],
  templateUrl: './add-supplier.html',
  styleUrl: './add-supplier.css',
  providers: [MessageService]
  
})
export class AddSupplier implements OnInit {

  isEdit = false;
  supplierId!: string;
  states$!: Observable<State[]>;
  cities$!: Observable<City[]>;
  stockGroup$!:Observable<StockGroup[]>;
  department$!: Observable<DepartmentResponse[]>;
  subDepartment$!:Observable<SubDepartmentResponse[]>;
  transport$!:Observable<LookupDto<number>[]>;
  hsnCodes$!:Observable<LookupDto<string>[]>;
  supplierForm!: FormGroup;
   filteredAgents = signal<AgentTableResponse[]>([]);
   private readonly DEFAULT_STATE_ID = 1;   // Default State Gujarat ID
   private readonly DEFAULT_CITY_ID = 1;    // Defaul City Surat ID

  // Dropdown data
  registrationTypes = [
    { name: 'Regular', value: 1 },
    { name: 'Composition', value: 2 },
    { name: 'Unregistered', value: 3 }
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
    private masterService: MasterDataService,
    private supplierService:SupplierService,
    private loader: LoaderService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private stockGroupService:StockGroupService,
    private autocompleteService:AutoCompleteService,
  ) {}

  ngOnInit(): void {
   this.initForm();
  this.loadDropdowns();
  this.loadSupplierCode();
  this.checkEditMode();
  this.autoFillPanFromGstin();

  }

  initForm()
  {
    this.supplierForm = this.fb.group({
     id: [null], // instead of 0
     departmentId: [null, Validators.required],
     subDepartmentId: [null, Validators.required],
     userName: ['', Validators.required],
     name: ['', Validators.required],
     code: ['', Validators.required],
     alias: [''],
     gstIn: ['', Validators.pattern(/^[0-9A-Z]{15}$/)],
     pan: ['', Validators.pattern(/[A-Z]{5}[0-9]{4}[A-Z]{1}/)],
     regType: [1],
     address: [''],
     cityId: [null],
     stateId: [null],
     mobile: ['', Validators.pattern(/^[0-9]{10}$/)],
     email: ['', Validators.email],
     contactPerson: [''],
     bankName: [''],
     branch: [''],
     accountNumber: [''],
     ifsc: ['', Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)],
     UPID: [''],
     stockGroupId:[null],
     transportIds:[null],
     hsnCodeId:[null],
     creditDays: [null],       // changed from ''
     creditLimit: [null],      // changed from ''
     gstRegistrationDate: [null], // changed from ''
     MSMENumber: [''],
     eccNumber: [''],

     remarks: [''],
     discountType: [1, Validators.required],
     transactionType: [null],
     wholeSalesMargin: [null, Validators.required],
     retailMargin: [null, Validators.required],
     mrpMargin:[null,Validators.required],

     billDiscount:[null,Validators.required],
     paymentDiscount:[null],
     annualIncentive:[null],

     agentId: [null],
     agentObj:[null,Validators.required],
    });

  }
autoFillPanFromGstin() {
  this.supplierForm.get('gstIn')?.valueChanges.subscribe(gstin => {

    if (gstin && gstin.length >= 12) {

      const pan = gstin.substring(2, 12);

      this.supplierForm.patchValue(
        { pan: pan },
        { emitEvent: false }
      );
    }
  });
}

  loadDropdowns() {
    this.department$ = this.masterService.getDepartments();
    this.states$ = this.masterService.getStates();
  }

  checkEditMode() {
    this.supplierId = this.route.snapshot.paramMap.get('id')!;

    if (this.supplierId) {
      this.isEdit = true;
      this.loadSupplierForEdit();
    } else {
      this.loadSupplierCode(); // Add mode only
      this.stockGroup$ = this.stockGroupService.getAll();
      this.transport$ = this.masterService.getTransportLookup();
      this.hsnCodes$ = this.masterService.getHsnCodeLookup();
      this.setDefaultStateAndCity();   // Default State & City
    }
    
  }
setDefaultStateAndCity() {

  // Set state
  this.supplierForm.patchValue({
    stateId: this.DEFAULT_STATE_ID
  });

  // Load cities for that state
  this.cities$ = this.masterService.getCitiesByStateId(this.DEFAULT_STATE_ID);

  // Set city
  this.supplierForm.patchValue({
    cityId: this.DEFAULT_CITY_ID
  });
}


  loadSupplierForEdit() {
    this.loader.show();
    this.supplierService.getSupplier(this.supplierId)
      .pipe(finalize(() => this.loader.hide()))
      .subscribe({
        next: supplier => {
          
          this.supplierForm.patchValue(supplier);

          // Load subDepartments & cities based on existing values
          if (supplier.subDepartmentId) {
            this.subDepartment$ = this.masterService.getSubDepartments(supplier.departmentId);
          }
          if (supplier.stateId) {
            this.cities$ = this.masterService.getCitiesByStateId(supplier.stateId);
          }

          this.supplierForm.get('userName')?.disable();
          this.supplierForm.get('code')?.disable();
        },
       error: err => {
        console.error('Error loading supplier', err);
        this.router.navigate(['admin/not-found'])
     }
      });
  }

  loadSupplierCode() {
  this.supplierService.getSupplierCode().subscribe(result => {
    this.supplierForm.patchValue({ code: result.data });
      this.supplierForm.get('code')?.disable();
  }, error => {
    console.error('Failed to load supplier code', error);
  });
}



submit() {
  if (this.supplierForm.invalid) {
    this.supplierForm.markAllAsTouched();
    return;
  }
  
   const agentSelected = this.supplierForm.value.agentObj as AgentTableResponse;
    
    const request = {
      ...this.supplierForm.value,
      agentId: agentSelected?.id,  
      id: this.supplierId
    };
  request.id=this.supplierId;
  this.loader.show();

  this.supplierService.createSupplier(request)
    .pipe(finalize(() => this.loader.hide())) 
    .subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Supplier saved successfully!'
        });
        if(this.supplierId)
        {
          setTimeout(() => {
            this.router.navigate(['admin/suppliers']);
          }, 1000);
        }
        else
        {
        this.supplierForm.reset();
        }
      }
      
    });
}


  onDepartmentChange(event: any) {
   const departmentId = event.value; 
  this.subDepartment$ = this.masterService.getSubDepartments(departmentId);
  }

  onStateChange(event: any) {
    
    const stateId = event.value;
    this.cities$ = this.masterService.getCitiesByStateId(stateId);
    this.supplierForm.patchValue({ cityId: '' });
  }

  
 searchAgent(event: any) {
  
  const query = event.query;
 
   this.autocompleteService.searchAgents(query).subscribe(res => {
     this.filteredAgents.set(res); 
   });
 }
}
