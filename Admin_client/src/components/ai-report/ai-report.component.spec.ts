import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiReportComponent } from './ai-report.component';

describe('AiReportComponent', () => {
  let component: AiReportComponent;
  let fixture: ComponentFixture<AiReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
