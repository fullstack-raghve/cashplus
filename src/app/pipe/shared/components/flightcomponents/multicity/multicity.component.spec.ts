import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MulticityComponent } from './multicity.component';

describe('MulticityComponent', () => {
  let component: MulticityComponent;
  let fixture: ComponentFixture<MulticityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MulticityComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MulticityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
