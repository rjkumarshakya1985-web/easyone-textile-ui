import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSupplierProduct } from './add-product';

describe('AddProduct', () => {
  let component: AddSupplierProduct;
  let fixture: ComponentFixture<AddSupplierProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSupplierProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSupplierProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
