import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-add-transport',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, 
    InputTextModule, SelectModule , 
    ButtonModule, CardModule, 
    TextareaModule,TooltipModule,FloatLabelModule],
  templateUrl: './add-transport.html',
  styleUrls: ['./add-transport.css']
})
export class AddTransport implements OnInit {

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
     private transportService:TransportService
     ) {}

  ngOnInit(): void {
   this.buildForm();
   this.states$ = this.masterService.getStates(); 
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
    id: 0,   // backend will generate ID
    name: formValue.name,
    stateId: Number(formValue.stateId),
    cityId: Number(formValue.cityId),
    gstin: formValue.gstin || '',
    registrationType: Number(formValue.registrationType),
    address: formValue.address,
    pincode: formValue.pincode,
    mobile: formValue.mobile,
    email: formValue.email || '',
    transportType: Number(formValue.transportType),
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
