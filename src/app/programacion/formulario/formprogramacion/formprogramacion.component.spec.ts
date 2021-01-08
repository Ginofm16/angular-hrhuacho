import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormprogramacionComponent } from './formprogramacion.component';

describe('FormprogramacionComponent', () => {
  let component: FormprogramacionComponent;
  let fixture: ComponentFixture<FormprogramacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormprogramacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormprogramacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
