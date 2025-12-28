import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSupplier } from './update-supplier';

describe('UpdateSupplier', () => {
  let component: UpdateSupplier;
  let fixture: ComponentFixture<UpdateSupplier>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateSupplier]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateSupplier);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
