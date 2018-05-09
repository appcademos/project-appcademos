/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AcademySignupFormComponent } from './academySignupForm.component';

describe('AcademySignupFormComponent', () => {
  let component: AcademySignupFormComponent;
  let fixture: ComponentFixture<AcademySignupFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademySignupFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcademySignupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
