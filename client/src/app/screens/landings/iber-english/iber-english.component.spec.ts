import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IberEnglishComponent } from './iber-english.component';

describe('IberEnglishComponent', () => {
  let component: IberEnglishComponent;
  let fixture: ComponentFixture<IberEnglishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IberEnglishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IberEnglishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
