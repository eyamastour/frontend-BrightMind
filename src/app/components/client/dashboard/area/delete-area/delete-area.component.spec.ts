import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAreaComponent } from './delete-area.component';

describe('DeleteAreaComponent', () => {
  let component: DeleteAreaComponent;
  let fixture: ComponentFixture<DeleteAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
