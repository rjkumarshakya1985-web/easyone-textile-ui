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
import { VisitorService } from '../../../../../core/services/visitor-service';

@Component({
  selector: 'app-add-visitor',
  imports: [CommonModule, ReactiveFormsModule, InputNumberModule,
    InputTextModule, SelectModule , ButtonModule, CardModule,
     TextareaModule, FloatLabelModule,ToastModule],
  templateUrl: './add-visitor.html',
  styleUrl: './add-visitor.css',
})
export class AddVisitor implements OnInit {
  visitorForm!: FormGroup;
  customerNotFound=false;
  isEdit = false; 
  VisitorId!: string;
  states$!: Observable<State[]>;
  cities$!: Observable<City[]>; 


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


  constructor(private fb: FormBuilder,
    private router: Router,
    private customerService:CustomerService,
    private masterService: MasterDataService,
    private loader: LoaderService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private visitorService:VisitorService
  ) {
      // this.loadDropdowns();
      // this.initForm();
  }
ngOnInit(): void {  
   this.initForm();
  this.loadDropdowns();
  this.checkEditMode();
  }
  initForm()
    {
      this.visitorForm = this.fb.group({
       id: [null], // instead of 0
       customerType: [1,Validators.required],
       name: ['', Validators.required],
       regType: [1,Validators.required],     
       cityId: [null,Validators.required],
       stateId:[null,Validators.required],      
       mobile: ['',Validators.required],
       remarks: ['']
      });

       this.visitorForm.get('name')?.valueChanges.subscribe(value => {
           this.visitorForm.get('mobile')?.setValue(value, { emitEvent: false });
           this.visitorForm.get('remarks')?.setValue(value, { emitEvent: false });
               });
  
    }
    /* SEARCH CUSTOMER */

searchCustomerByMobile(){

const mobile=this.visitorForm.get('mobile')?.value;

if(!mobile || mobile.length<10)return;

this.customerService.getCustomerbyMobile(mobile).subscribe({

next:(res:any)=>{

if(res){

this.customerNotFound=false;

this.visitorForm.patchValue({

customerId:res.customerId,
name:res.name,
mobile:res.mobile,
customerType:res.customerType,
cityId:res.cityId

});

}

},

error:()=>{

this.customerNotFound=true;

}

});

}
 checkEditMode() {
    this.VisitorId = this.route.snapshot.paramMap.get('id')!;
    if (this.VisitorId) {
      this.isEdit = true;
      this.loadVisitorForEdit();
    } 
  }
    loadVisitorForEdit() {
    this.loader.show();
    this.customerService.getCustomer(this.VisitorId)
      .pipe(finalize(() => this.loader.hide()))
      .subscribe({
        next: visitor => {
          
          this.visitorForm.patchValue(visitor);          
          if (visitor.stateId) {
            this.cities$ = this.masterService.getCitiesByStateId(visitor.stateId);
          }         
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
    this.visitorForm.patchValue({ cityId: '' });
  }
  submit(){
   
       if (this.visitorForm.invalid) {
          this.visitorForm.markAllAsTouched();
          return;
       }
   let request = this.visitorForm.value;
   request.id=this.VisitorId;
  this.loader.show();   
     if(!this.VisitorId)
        {   
    this.visitorService.create(request)
    .pipe(finalize(() => this.loader.hide())) 
    .subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Visitor saved successfully!'
        });      
 if(this.VisitorId)
        {
          setTimeout(() => {
            this.router.navigate(['/visitors']);
          }, 1000);
        }
        else
        {
        this.visitorForm.reset();
        }
      
      }
    
  });
      
}
else
{
   this.visitorService.update(this.VisitorId,request)
    .pipe(finalize(() => this.loader.hide())) 
    .subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Visitor updated successfully!'
        });      
 if(this.VisitorId)
        {
          setTimeout(() => {
            this.router.navigate(['/visitors']);
          }, 1000);
        }
        else
        {
        this.visitorForm.reset();
        }
      
      }
    
  });
}
}
}

