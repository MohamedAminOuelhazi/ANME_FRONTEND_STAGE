import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsulterPvComponent } from './consulter-pv.component';

describe('ConsulterPvComponent', () => {
  let component: ConsulterPvComponent;
  let fixture: ComponentFixture<ConsulterPvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsulterPvComponent]
    });
    fixture = TestBed.createComponent(ConsulterPvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
