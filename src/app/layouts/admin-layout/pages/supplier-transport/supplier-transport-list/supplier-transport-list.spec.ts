import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierTransportList } from './supplier-transport-list';

describe('SupplierTransportList', () => {
  let component: SupplierTransportList;
  let fixture: ComponentFixture<SupplierTransportList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierTransportList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierTransportList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
