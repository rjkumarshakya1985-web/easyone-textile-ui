import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstRuleList } from './gst-rule-list';

describe('GstRuleList', () => {
  let component: GstRuleList;
  let fixture: ComponentFixture<GstRuleList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GstRuleList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GstRuleList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
