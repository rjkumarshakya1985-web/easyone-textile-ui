
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, ButtonModule, TagModule],
templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  date = new Date();
  readyParcels = [
    { no: 9910, date: 'Sep 16, 2025', transport: 'MAA ANNAPURNA TRANSPORT AGENCY PVT. LTD.', qty: 22 },
    { no: 9893, date: 'Sep 15, 2025', transport: 'PATEL FLEET SERVICE PVT. LTD.', qty: 77 },
  ];

  cards = [
    { icon: 'pi pi-box', title: 'Active Product', value: 22, color: '#03A9F4' },
    { icon: 'pi pi-truck', title: 'Ready Parcel', value: 0, color: '#F44336' },
    { icon: 'pi pi-pencil', title: 'Dispatched Parcel', value: 0, color: '#FF9800' }
  ];
}
