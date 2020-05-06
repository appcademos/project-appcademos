import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextArrayEditorComponent } from './text-array-editor.component';

describe('TextArrayEditorComponent', () => {
  let component: TextArrayEditorComponent;
  let fixture: ComponentFixture<TextArrayEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextArrayEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextArrayEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
