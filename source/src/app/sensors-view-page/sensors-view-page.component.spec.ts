import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorsViewPageComponent } from './sensors-view-page.component';

describe('SensorsViewPageComponent', () => {
  let component: SensorsViewPageComponent;
  let fixture: ComponentFixture<SensorsViewPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorsViewPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorsViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
