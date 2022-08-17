import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterReturnwayComponent } from './filter-returnway.component';

describe('FilterReturnwayComponent', () => {
  let component: FilterReturnwayComponent;
  let fixture: ComponentFixture<FilterReturnwayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterReturnwayComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterReturnwayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
