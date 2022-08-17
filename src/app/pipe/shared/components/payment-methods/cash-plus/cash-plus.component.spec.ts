import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashPlusComponent } from './cash-plus.component';

describe('CashPlusComponent', () => {
  let component: CashPlusComponent;
  let fixture: ComponentFixture<CashPlusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashPlusComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashPlusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
