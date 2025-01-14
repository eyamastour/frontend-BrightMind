import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteInstallationComponent } from './delete-installation.component';

describe('DeleteInstallationComponent', () => {
  let component: DeleteInstallationComponent;
  let fixture: ComponentFixture<DeleteInstallationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteInstallationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteInstallationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
