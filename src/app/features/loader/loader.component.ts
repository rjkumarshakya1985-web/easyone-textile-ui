import { Component, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoaderService } from '../../core/services/loader.service';



@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  template: `
    <div class="loader-overlay" *ngIf="isLoading()">
      <div class="loader-card" aria-label="Loading data">
        <p-progress-spinner></p-progress-spinner>
        <span>Loading data...</span>
      </div>
    </div>
  `,
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  isLoading: Signal<boolean>;

  constructor(private loaderService: LoaderService) {
    this.isLoading=this.loaderService.loading;
  }
 
}
