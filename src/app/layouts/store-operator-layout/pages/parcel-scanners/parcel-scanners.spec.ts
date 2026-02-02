import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelScanners } from './parcel-scanners';

describe('ParcelScanners', () => {
  let component: ParcelScanners;
  let fixture: ComponentFixture<ParcelScanners>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParcelScanners]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParcelScanners);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
