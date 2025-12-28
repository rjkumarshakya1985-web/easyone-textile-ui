import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalevoucherList } from './salevoucher-list';

describe('SalevoucherList', () => {
  let component: SalevoucherList;
  let fixture: ComponentFixture<SalevoucherList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalevoucherList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalevoucherList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
