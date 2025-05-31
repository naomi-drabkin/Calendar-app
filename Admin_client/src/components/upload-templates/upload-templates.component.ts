
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UploadService } from '../../services/upload-service.service';
import { TemplateDto } from '../../models/TemplateDto';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-template-manager',
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './upload-templates.component.html',
  styleUrls: ['./upload-templates.component.css'],
})
export class UploadTemplatesComponent{
  templates: TemplateDto[] = [];
  templates$: BehaviorSubject<TemplateDto[]> = new BehaviorSubject<TemplateDto[]>([]);
  selectedFile: File | null = null;
  imagePreview: string | null = null; 
  imgeExtension: string | undefined = undefined; 
  isUploading: boolean = false;
  deletingTemplateId: string | null = null;
  selectedFileName: string = '';


  constructor(private uploadService: UploadService) {
  }

  ngOnInit(): void {
    this.loadTemplates(); 
  }

  loadTemplates(): void {
    this.uploadService.getAllTemplates().subscribe({
      next: (templates) => {
  
        const sortedTemplates = templates.sort((a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
  
        this.templates = sortedTemplates;
        this.templates$.next(sortedTemplates);
      },
      error: (err) => {
        console.error('שגיאה בטעינת תבניות:', err);
      }
    });
  }
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
      this.imgeExtension = this.selectedFile.name.split('.').pop()?  this.selectedFile.name.split('.').pop():undefined; // קבלת סיומת הקובץ

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  upload(): void {
    if (this.selectedFile) {
      this.isUploading = true;
  
      this.uploadService.uploadFile(this.selectedFile).subscribe({
        next: () => {
          this.selectedFile = null;
          this.selectedFileName = '';
          this.imagePreview = null;
          this.loadTemplates();
          this.isUploading = false;
        },
        error: (err) => {
          console.error('Error uploading file:', err);
          this.isUploading = false;
        },
      });
    }
  }
  
  deleteTemplate(template: TemplateDto): void {
    this.deletingTemplateId = template.name; 
  
    this.uploadService.deleteTemplate(template).subscribe({
      next: () => {
        this.loadTemplates();
        this.deletingTemplateId = null;
      },
      error: (err) => {
        console.error('Error deleting template:', err);
        this.deletingTemplateId = null;
      },
    });
  }
  

}