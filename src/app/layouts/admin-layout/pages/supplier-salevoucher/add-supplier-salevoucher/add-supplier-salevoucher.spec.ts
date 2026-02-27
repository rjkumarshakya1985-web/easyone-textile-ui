import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSupplierSalevoucher } from './add-supplier-salevoucher';

describe('AddSupplierSalevoucher', () => {
  let component: AddSupplierSalevoucher;
  let fixture: ComponentFixture<AddSupplierSalevoucher>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSupplierSalevoucher]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSupplierSalevoucher);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
