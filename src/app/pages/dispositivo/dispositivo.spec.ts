import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dispositivos } from './dispositivo';

describe('Dispositivo', () => {
  let component: Dispositivos;
  let fixture: ComponentFixture<Dispositivos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dispositivos],
    }).compileComponents();

    fixture = TestBed.createComponent(Dispositivos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
