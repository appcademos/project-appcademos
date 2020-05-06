import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesTutorialComponent } from './favorites-tutorial.component';

describe('FavoritesTutorialComponent', () => {
  let component: FavoritesTutorialComponent;
  let fixture: ComponentFixture<FavoritesTutorialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoritesTutorialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritesTutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
