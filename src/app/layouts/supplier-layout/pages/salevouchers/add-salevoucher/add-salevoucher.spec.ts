import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalevoucher } from './add-salevoucher';

describe('AddSalevoucher', () => {
  let component: AddSalevoucher;
  let fixture: ComponentFixture<AddSalevoucher>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSalevoucher]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSalevoucher);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
