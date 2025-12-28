import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemCategory } from './add-item-category';

describe('AddItemCategory', () => {
  let component: AddItemCategory;
  let fixture: ComponentFixture<AddItemCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddItemCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddItemCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
