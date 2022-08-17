import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OriginListModalComponent } from './origin-list-modal.component';

describe('OriginListModalComponent', () => {
  let component: OriginListModalComponent;
  let fixture: ComponentFixture<OriginListModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OriginListModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OriginListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
