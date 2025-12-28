import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundRecord } from './not-found-record';

describe('NotFoundRecord', () => {
  let component: NotFoundRecord;
  let fixture: ComponentFixture<NotFoundRecord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundRecord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotFoundRecord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
