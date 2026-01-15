import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StickerPrint } from './sticker-print';

describe('StickerPrint', () => {
  let component: StickerPrint;
  let fixture: ComponentFixture<StickerPrint>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StickerPrint]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StickerPrint);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
