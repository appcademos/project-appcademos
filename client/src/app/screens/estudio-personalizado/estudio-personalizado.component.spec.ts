import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudioPersonalizadoComponent } from './estudio-personalizado.component';

describe('EstudioPersonalizadoComponent', () => {
  let component: EstudioPersonalizadoComponent;
  let fixture: ComponentFixture<EstudioPersonalizadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstudioPersonalizadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstudioPersonalizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
