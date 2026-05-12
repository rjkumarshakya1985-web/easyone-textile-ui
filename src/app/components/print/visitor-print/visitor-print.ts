import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VisitorService } from '../../../core/services/visitor-service';
import { VisitorResponse } from '../../../model/response/visitor/visitor-response.model';
import { CommonModule } from '@angular/common';
import printJS from 'print-js';
import { NgxBarcode6Module } from 'ngx-barcode6';
import { FormsModule } from '@angular/forms';
@Component({
   selector: 'app-visitor-print',
  standalone: true,
  imports: [CommonModule,NgxBarcode6Module,FormsModule],
  templateUrl: './visitor-print.html',
  styleUrl: './visitor-print.css',
})
export class VisitorPrint {

  visitorResponse = signal<VisitorResponse | null>(null);
  visitorId!: number;
  
  constructor(
    private visitorService: VisitorService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.visitorId = +params['id'];

      this.visitorService.getById(this.visitorId).subscribe(res => {
         this.visitorResponse.set(res);
      });
    });

  }
copyCount = 1;

copiesArray(): number[] {
  return Array(this.copyCount).fill(0);
}

  printPage() {

   printJS({
    printable: 'print-area',
    type: 'html',
    targetStyles: ['*'],
    documentTitle: 'Visitor Slip',
     scanStyles: true,
     maxWidth: 800
  });

  }
}