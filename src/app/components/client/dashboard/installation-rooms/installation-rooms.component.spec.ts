import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallationRoomsComponent } from './installation-rooms.component';

describe('InstallationRoomsComponent', () => {
  let component: InstallationRoomsComponent;
  let fixture: ComponentFixture<InstallationRoomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstallationRoomsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstallationRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
