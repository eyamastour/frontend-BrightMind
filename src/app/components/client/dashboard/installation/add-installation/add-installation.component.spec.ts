import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInstallationComponent } from './add-installation.component';

describe('AddInstallationComponent', () => {
  let component: AddInstallationComponent;
  let fixture: ComponentFixture<AddInstallationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddInstallationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddInstallationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
