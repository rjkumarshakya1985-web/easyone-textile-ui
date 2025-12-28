import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHsnCode } from './add-hsn-code';

describe('AddHsnCode', () => {
  let component: AddHsnCode;
  let fixture: ComponentFixture<AddHsnCode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddHsnCode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHsnCode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
