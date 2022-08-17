import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CropperModalComponent } from './cropper-modal.component';

describe('CropperModalComponent', () => {
  let component: CropperModalComponent;
  let fixture: ComponentFixture<CropperModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CropperModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CropperModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
