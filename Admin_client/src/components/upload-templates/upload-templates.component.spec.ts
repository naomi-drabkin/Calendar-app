import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadTemplatesComponent } from './upload-templates.component';


describe('AploadTemplatesComponent', () => {
  let component: UploadTemplatesComponent;
  let fixture: ComponentFixture<UploadTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadTemplatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
