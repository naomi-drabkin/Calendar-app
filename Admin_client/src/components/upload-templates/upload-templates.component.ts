
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
  templates: TemplateDto[] = []; // נתונים לשימוש מקומי
  templates$: BehaviorSubject<TemplateDto[]> = new BehaviorSubject<TemplateDto[]>([]);
  selectedFile: File | null = null; // קובץ נבחר
  imagePreview: string | null = null; // תצוגה מקדימה
  imgeExtension: string | undefined = undefined; // סיומת התמונה
  isUploading: boolean = false;
  deletingTemplateId: string | null = null;
  selectedFileName: string = '';


  constructor(private uploadService: UploadService) {
    // this.loadTemplates(); // טוען את רשימת התבניות בעת יצירת הקומפוננטה
  }

  ngOnInit(): void {
    this.loadTemplates(); // תתבצע פעם אחת כשנטען הקומפוננט
  }

  loadTemplates(): void {
    this.uploadService.getAllTemplates().subscribe({
      next: (templates) => {
        console.log('רשימת תבניות מהשרת:', templates);
  
        // מיון לפי uploadedAt (מהחדש לישן)
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
  
  // בחירת קובץ
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
      console.log(this.selectedFileName);
      this.imgeExtension = this.selectedFile.name.split('.').pop()?  this.selectedFile.name.split('.').pop():undefined; // קבלת סיומת הקובץ
      // יצירת תצוגה מקדימה של התמונה
      console.log(this.imgeExtension);
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // העלאת קובץ
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
  

  // מחיקת תבנית
  deleteTemplate(template: TemplateDto): void {
    this.deletingTemplateId = template.name; // בהנחה שלכל TemplateDto יש id
  
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
  

  // // טיפול בשגיאות טעינת תמונה
  // handleImageError(event: Event): void {
  //   const imgElement = event.target as HTMLImageElement;
  //   imgElement.src = 'assets/default-image.png'; // תמונה חלופית במקרה של שגיאה
  // }
}