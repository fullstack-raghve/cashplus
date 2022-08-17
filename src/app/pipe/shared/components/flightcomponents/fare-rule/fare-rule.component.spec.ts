import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FareRuleComponent } from './fare-rule.component';

describe('FareRuleComponent', () => {
  let component: FareRuleComponent;
  let fixture: ComponentFixture<FareRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FareRuleComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FareRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
