import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorPrint } from './visitor-print';

describe('VisitorPrint', () => {
  let component: VisitorPrint;
  let fixture: ComponentFixture<VisitorPrint>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitorPrint]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorPrint);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
