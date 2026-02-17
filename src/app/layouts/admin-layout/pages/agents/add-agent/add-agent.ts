import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Select, SelectModule  } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TextareaModule  } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { finalize, Observable } from 'rxjs';
import { MasterDataService } from '../../../../../core/services/master-data-service';
import { State } from '../../../../../model/state.model';
import { City } from '../../../../../model/city.model';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { LoaderService } from '../../../../../core/services/loader.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ActivatedRoute, Router } from '@angular/router';
import { MultiSelectModule } from 'primeng/multiselect';
import { AgentService } from '../../../../../core/services/agent-service';
import { LookupDto } from '../../../../../model/views/lookup.model';

@Component({
  selector: 'app-add-agent',
  imports: [CommonModule, ReactiveFormsModule, InputNumberModule,
    InputTextModule, SelectModule , ButtonModule, CardModule,
     TextareaModule,Select, FloatLabelModule,DatePickerModule,ToastModule
     ,MultiSelectModule],
  templateUrl: './add-agent.html',
  styleUrl: './add-agent.css',
    providers: [MessageService]
})
export class AddAgent implements OnInit {

  isEdit = false;
  agentId!: string;
  states$!: Observable<State[]>;
  cities$!: Observable<City[]>;
  agentForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private router: Router,
    private masterService: MasterDataService,
    private agentService:AgentService,
    private loader: LoaderService,
    private messageService: MessageService,
    private route: ActivatedRoute,

  ) {}

  ngOnInit(): void {
   this.initForm();
  this.loadDropdowns();
  this.checkEditMode();
  }

  initForm()
  {
    this.agentForm = this.fb.group({
     id: [null], // instead of 0
     name: ['', Validators.required],
     contactPersonName:['',Validators.required],
     gstin: ['', Validators.pattern(/^[0-9A-Z]{15}$/)],
     pan: ['', Validators.pattern(/[A-Z]{5}[0-9]{4}[A-Z]{1}/)],
     address: [''],
     cityId: [null],
     stateId: [null],
     area:[''],
     pincode:['', Validators.pattern(/^[0-9]{6}$/)],
     tallyLedgerName:[''],
     contactPersonMobile: ['',  [
    Validators.required,
    Validators.pattern(/^[0-9]{10}$/)
  ]],
     email: ['', Validators.email]
    });

  }

  loadDropdowns() {
    this.states$ = this.masterService.getStates();
  }

  checkEditMode() {
    this.agentId = this.route.snapshot.paramMap.get('id')!;

    if (this.agentId) {
      this.isEdit = true;
      this.loadAgentForEdit();
    } 
    
  }

  loadAgentForEdit() {
    this.loader.show();
    this.agentService.getAgent(this.agentId)
      .pipe(finalize(() => this.loader.hide()))
      .subscribe({
        next: agent => {
          
          this.agentForm.patchValue(agent);

          // Load cities based on existing values
         
          if (agent.stateId) {
            this.cities$ = this.masterService.getCitiesByStateId(agent.stateId);
          }

          this.agentForm.get('userName')?.disable();
          this.agentForm.get('code')?.disable();
        },
       error: err => {
        console.error('Error loading agent', err);
        this.router.navigate(['admin/not-found'])
     }     
      });
  }
submit() {
  if (this.agentForm.invalid) {
    this.agentForm.markAllAsTouched();
    return;
  }
  const request = this.agentForm.value;
 
  request.id=this.agentId;
  this.loader.show();

  this.agentService.createAgent(request)
    .pipe(finalize(() => this.loader.hide())) 
    .subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Agent saved successfully!'
        });
        if(this.agentId)
        {
          setTimeout(() => {
            this.router.navigate(['admin/agents']);
          }, 1000);
        }
        else
        {
        this.agentForm.reset();
        }
      }
      
    });
}
  onStateChange(event: any) {
    
    const stateId = event.value;
    this.cities$ = this.masterService.getCitiesByStateId(stateId);
    this.agentForm.patchValue({ cityId: '' });
  }
}
