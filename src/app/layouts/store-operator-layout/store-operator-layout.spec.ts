import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreOperatorLayout } from './store-operator-layout';

describe('StoreOperatorLayout', () => {
  let component: StoreOperatorLayout;
  let fixture: ComponentFixture<StoreOperatorLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreOperatorLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreOperatorLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
