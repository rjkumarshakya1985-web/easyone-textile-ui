import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePorduct } from './update-porduct';

describe('UpdatePorduct', () => {
  let component: UpdatePorduct;
  let fixture: ComponentFixture<UpdatePorduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePorduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePorduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
