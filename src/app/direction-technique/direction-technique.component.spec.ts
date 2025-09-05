import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectionTechniqueComponent } from './direction-technique.component';

describe('DirectionTechniqueComponent', () => {
  let component: DirectionTechniqueComponent;
  let fixture: ComponentFixture<DirectionTechniqueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DirectionTechniqueComponent]
    });
    fixture = TestBed.createComponent(DirectionTechniqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
