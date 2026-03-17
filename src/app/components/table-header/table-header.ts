import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
@Component({
  selector: 'app-table-header',
  imports: [CommonModule,ReactiveFormsModule,TableModule,ButtonModule,
    SelectModule,FormsModule],
  standalone: true,
  templateUrl: './table-header.html',
  styleUrl: './table-header.css',
})
export class TableHeader {
 @Input() title!: string;
  @Input() field!: string;
  @Input() sortable: boolean = true;
@Input() value: any;   // 👈 ADD THIS
@Output() valueChange = new EventEmitter<any>();
  @Input() filterType: 'text' | 'select' | null = null;
  @Input() matchMode: string = 'contains';
  @Input() placeholder: string = '';
  @Input() options: any[] = [];

  @Output() onApply = new EventEmitter<{ field: string; value: any }>();
  @Output() onClear = new EventEmitter<string>();

  inputValue: any;

  apply(filterCallback: any) {
   filterCallback(this.value);
   this.onApply.emit({ field: this.field, value: this.value });
  }

  clear(filterCallback: any) {
    this.value = null;
   this.valueChange.emit(this.value); // 👈 sync back to parent
  filterCallback(null);
  this.onClear.emit(this.field);
  }
}
