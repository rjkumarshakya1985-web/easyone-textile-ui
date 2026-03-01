import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoverChart } from './turnover-chart';

describe('TurnoverChart', () => {
  let component: TurnoverChart;
  let fixture: ComponentFixture<TurnoverChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnoverChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnoverChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
