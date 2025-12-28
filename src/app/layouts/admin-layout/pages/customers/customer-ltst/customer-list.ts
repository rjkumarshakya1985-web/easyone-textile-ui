import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Customer } from '../../../../../model/customer.model';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-customer-list',
  imports: [CommonModule, TableModule,CardModule,ButtonModule,BreadcrumbModule,ToolbarModule],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css',
})
export class CustomerList {

  constructor(private router: Router) {}

  breadcrumbItems: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/admin' },
    { label: 'Customer' }
  ];
  
  customers: Customer[] = [
  {
    id: 1,
    customerName: 'Alpha Logistics',
    gstin: '27AAAAA1234A1Z5',
    registrationType: 'Regular',
    billingAddress: 'Andheri East, Mumbai',
    city: 101,
    pin: '400059',
    mobile: '9876543210',
    email: 'alpha@logistics.com',
    remarks: 'Priority transporter'
  },
  {
    id: 2,
    customerName: 'FastTrack Movers',
    gstin: '07BBBBB5678B2Z3',
    registrationType: 'Composition',
    billingAddress: 'Sector 10, Rohini',
    city: 102,
    pin: '110085',
    mobile: '9012345678',
    email: 'fasttrack@move.com',
    remarks: ''
  },
  {
    id: 3,
    customerName: 'Green Transport Co.',
    gstin: '07BBBBB5678B2Z3',
    registrationType: 'Unregistered',
    billingAddress: 'Baner, Pune',
    city: 103,
    state: 27,
    pin: '411045',
    mobile: '9123456780',
    email: '',
    remarks: 'Local transport'
  }
];


  goToAddCustomer() {
    this.router.navigate(['admin/customer/add']);
  }

  goToEditCustomer(id: number) {
    this.router.navigate(['admin/customer/edit', id]);
  }

}
