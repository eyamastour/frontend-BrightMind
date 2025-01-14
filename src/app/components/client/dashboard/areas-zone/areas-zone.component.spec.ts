import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreasZoneComponent } from './areas-zone.component';

describe('AreasZoneComponent', () => {
  let component: AreasZoneComponent;
  let fixture: ComponentFixture<AreasZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreasZoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreasZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
