import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportSalevoucher } from './export-salevoucher';

describe('ExportSalevoucher', () => {
  let component: ExportSalevoucher;
  let fixture: ComponentFixture<ExportSalevoucher>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportSalevoucher]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportSalevoucher);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
