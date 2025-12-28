import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCategoryList } from './item-category-list';

describe('ItemCategoryList', () => {
  let component: ItemCategoryList;
  let fixture: ComponentFixture<ItemCategoryList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemCategoryList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemCategoryList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
