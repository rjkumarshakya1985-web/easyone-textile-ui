import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HsnCodeList } from './hsn-code-list';

describe('HsnCodeList', () => {
  let component: HsnCodeList;
  let fixture: ComponentFixture<HsnCodeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HsnCodeList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HsnCodeList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
