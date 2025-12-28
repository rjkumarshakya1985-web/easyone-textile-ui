import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSalevoucher } from './update-salevoucher';

describe('UpdateSalevoucher', () => {
  let component: UpdateSalevoucher;
  let fixture: ComponentFixture<UpdateSalevoucher>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateSalevoucher]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateSalevoucher);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
