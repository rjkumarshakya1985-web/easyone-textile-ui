import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubdepartmentList } from './subdepartment-list';

describe('SubdepartmentList', () => {
  let component: SubdepartmentList;
  let fixture: ComponentFixture<SubdepartmentList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubdepartmentList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubdepartmentList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
