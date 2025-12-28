import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
   templateUrl: './not-found-record.html',
  styles: [`
    .not-found-container {
      text-align: center;
      margin-top: 50px;
      color: #555;
    }
    .not-found-container h2 {
      color: #e53935;
    }
  `]
})
export class NotFoundRecord {}
