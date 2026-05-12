import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VisitorService } from '../../../core/services/visitor-service';
import { VisitorResponse } from '../../../model/response/visitor/visitor-response.model';
import { CommonModule } from '@angular/common';
import printJS from 'print-js';
import { NgxBarcode6Module } from 'ngx-barcode6';

@Component({
   selector: 'app-visitor-print',
  standalone: true,
  imports: [CommonModule,NgxBarcode6Module],
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

  printPage() {

   printJS({
    printable: 'print-section',
    type: 'html',
    targetStyles: ['*'],
    documentTitle: 'Visitor Slip'
  });

  }
}