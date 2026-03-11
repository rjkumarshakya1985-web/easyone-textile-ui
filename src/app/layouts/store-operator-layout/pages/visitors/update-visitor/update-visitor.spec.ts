import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateVisitor } from './update-visitor';

describe('UpdateVisitor', () => {
  let component: UpdateVisitor;
  let fixture: ComponentFixture<UpdateVisitor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateVisitor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateVisitor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
