import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGuestForgotComponent } from './new-guest-forgot.component';

describe('NewGuestForgotComponent', () => {
  let component: NewGuestForgotComponent;
  let fixture: ComponentFixture<NewGuestForgotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewGuestForgotComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewGuestForgotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
