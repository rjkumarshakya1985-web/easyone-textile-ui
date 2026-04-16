import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAdjustmentList } from './stock-adjustment-list';

describe('StockAdjustmentList', () => {
  let component: StockAdjustmentList;
  let fixture: ComponentFixture<StockAdjustmentList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockAdjustmentList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockAdjustmentList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
