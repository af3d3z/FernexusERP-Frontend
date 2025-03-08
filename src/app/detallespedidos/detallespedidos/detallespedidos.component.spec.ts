import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallespedidosComponent } from './detallespedidos.component';

describe('DetallespedidosComponent', () => {
  let component: DetallespedidosComponent;
  let fixture: ComponentFixture<DetallespedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallespedidosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallespedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
