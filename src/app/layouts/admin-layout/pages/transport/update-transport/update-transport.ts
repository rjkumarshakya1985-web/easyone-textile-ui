import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule  } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TextareaModule  } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { MasterDataService } from '../../../../../core/services/master-data-service';
import { State } from '../../../../../model/state.model';
import { City } from '../../../../../model/city.model';
import { RegistrationType, TransportType } from '../../../../../core/enums/enum';
import { Observable } from 'rxjs';
import { TransportService } from '../../../../../core/services/transport-service';
import { TransportRequest } from '../../../../../model/request/transport-add-request.model';

@Component({
  selector: 'app-update-transport',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, 
    InputTextModule, SelectModule , ButtonModule, CardModule, 
    TextareaModule,TooltipModule],
  templateUrl: './update-transport.html',
  styleUrl: './update-transport.css',
})
export class UpdateTransport implements OnInit {
 id:number =0;
 states$!: Observable<State[]>;
 cities$!: Observable<City[]>;
  
  transportForm!: FormGroup;

  registrationTypes = [
    { label: 'Regular', value: RegistrationType.Regular },
    { label: 'Composition', value: RegistrationType.Composition },
    { label: 'Unregistered', value: RegistrationType.Unregistered }
  ];

   transportTypes = [
      { label: 'Purchase', value: TransportType.Purchase },
      { label: 'Sale', value: TransportType.Sales },
      { label: 'Both', value: TransportType.Both }
    ];


  constructor(private fb: FormBuilder,
     private router: Router,
     private masterService:MasterDataService,
     private transportService:TransportService,
     private route: ActivatedRoute 
     ) {}

  ngOnInit(): void {
   
   this.buildForm();
   this.states$ = this.masterService.getStates();

   const id = Number(this.route.snapshot.paramMap.get('id')); // 👉 read from URL
   
   if (id) {
    this.id=id;
    this.loadTransport(id);
    }

  }
  
  private loadTransport(id: number) {
  this.transportService.get(id).subscribe({
    next: (data) => {
      // Load cities of selected state first
      this.cities$ = this.masterService.getCitiesByStateId(data.stateId);

      // Patch values
      this.transportForm.patchValue({
        name: data.name,
        stateId: data.stateId,
        cityId: data.cityId,
        gstin: data.gstin,
        registrationType: data.registrationType,
        transportType:data.transportType,
        address: data.address,
        pincode: data.pincode,
        mobile: data.mobile,
        email: data.email,
        remarks: data.remarks
      });
    },
    error: (err) => {
       this.router.navigate(['admin/not-found'])
      console.error('Error loading transport:', err);
    }
  });
}

  private buildForm() {
    this.transportForm = this.fb.group({
      name: ['', Validators.required],
      stateId: ['', Validators.required],
      cityId: ['', Validators.required],
      gstin: ['', [Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/)]],
      registrationType: [null, Validators.required],
      transportType: [null, Validators.required],
      address: [''],
      pincode: [''],
      mobile: [''],
      email: [''],
      remarks: ['']
    });
  }

 
  

  onStateChange(event: any) {
    const stateId = event.target.value;
    this.cities$ = this.masterService.getCitiesByStateId(stateId);
    this.transportForm.patchValue({ cityId: '' });
  }

 submit() {
  if (this.transportForm.invalid) {
    this.transportForm.markAllAsTouched();
    return;
  }

  const formValue = this.transportForm.value;

  const transportData: TransportRequest = {
    id: this.id,   // backend will generate ID
    name: formValue.name,
    stateId: Number(formValue.stateId),
    cityId: Number(formValue.cityId),
    gstin: formValue.gstin || '',
    registrationType: Number(formValue.registrationType),
    transportType: Number(formValue.transportType),
    address: formValue.address,
    pincode: formValue.pincode,
    mobile: formValue.mobile,
    email: formValue.email || '',
    remarks: formValue.remarks || ''
  };

  this.transportService.add(transportData).subscribe({
    next: (res) => {
      if (res) {
        this.router.navigate(['admin/transports']);
      } else {
        alert('Something went wrong');
      }
    },
    error: (err) => {
      console.error('Error:', err);
      alert('Error saving transport');
    }
  });
}



  cancel() {
    this.router.navigate(['admin/transports']);
  }

}
