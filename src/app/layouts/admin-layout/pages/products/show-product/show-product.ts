import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../../../core/services/loader.service';
import { SupplierProductService } from '../../../../../core/services/supplier-product-service';
import { finalize } from 'rxjs';
import { SupplierProductDto } from '../../../../../model/entity/products/supplier-product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-show-product',
  imports: [CommonModule],
  templateUrl: './show-product.html',
  styleUrl: './show-product.css',
})
export class ShowProduct implements OnInit {
  
  productId!: string;
  supplierProduct = signal<SupplierProductDto | null>(null);
  

  constructor(private route: ActivatedRoute,private router: Router,
    private loader: LoaderService,private supplierProductService: SupplierProductService) {}

  ngOnInit(): void {
 
    this.checkEditMode();
  
  }

  getGstTaxabilityLabel(value: number): string {
  switch (value) {
    case 1:
      return 'Taxable';
    case 2:
      return 'Exempt';
    case 3:
      return 'NilRated';
    default:
      return 'Unknown';
  }
}


  checkEditMode() {
    this.productId = this.route.snapshot.paramMap.get('id')!;

    if (this.productId) {
      this.loadProductForEdit();
    }
   
  }

   loadProductForEdit() {
    
      this.loader.show();
      this.supplierProductService.getById(this.productId)
        .pipe(finalize(() => this.loader.hide()))
        .subscribe({
          next: product => {
           this.supplierProduct.set(product);
          
          },
         error: err => {
          console.error('Error loading supplier', err);
          this.router.navigate(['admin/not-found'])
       }
    });
    
  }
  
}
