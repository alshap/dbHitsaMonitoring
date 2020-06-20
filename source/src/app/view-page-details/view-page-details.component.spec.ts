import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPageDetailsComponent } from './view-page-details.component';

describe('ViewPageDetailsComponent', () => {
  let component: ViewPageDetailsComponent;
  let fixture: ComponentFixture<ViewPageDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPageDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
