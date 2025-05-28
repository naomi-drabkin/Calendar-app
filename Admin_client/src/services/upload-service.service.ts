import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UsersService } from './users.service';
import { TemplateDto } from '../models/TemplateDto';
import { _http } from '../app/app.component';


@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private serverUrl = `${_http}/api/templates`; // עדכן לפי כתובת ה-API שלך
  private downloadUrl = `${_http}/api/upload`; // עדכן לפי כתובת ה-API שלך


  constructor(private http: HttpClient,
    private userService: UsersService
  ) {}

  // קבלת URL להורדת תמונה
  getDownloadUrl(fileName: string): Observable<string> {
    return this.http.get(`${this.downloadUrl}/download-url/${fileName}`, {
      responseType: 'text'
    });
  }

  // קבלת כל התבניות
  getAllTemplates(): Observable<TemplateDto[]> {
    return this.http.get<TemplateDto[]>(`${this.serverUrl}/get-all-templates`);
  }

  // העלאת קובץ
  // uploadFile(file: File): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('file', file); // זה הקובץ עצמו
  //   formData.append('fileName', file.name); // זה השם שהשרת דורש
  //   formData.append('extention', file.name.split('.').pop() || ''); // זה הסיומת של הקובץ


  //   return this.http.post(
  //     `${this.serverUrl}/upload-image`,
  //     formData,
  //     this.userService.getAuthHeaders() // אם את משתמשת באותנטיקציה
  //   );
  // }

  uploadFile(file: File): Observable<any> {
    const cleanFileName = this.cleanFileName(file.name);
    const extension = file.name.split('.').pop()?.toLowerCase() || 'png';
    const randomId = Math.random().toString(36).substring(2, 8);
    const finalFileName = `${cleanFileName}${randomId}.${extension}`;
  
    const formData = new FormData();
    const sanitizedFile = new File([file], finalFileName, { type: file.type });
  
    formData.append('file', sanitizedFile); // הקובץ עצמו עם שם מנוקה
    formData.append('fileName', finalFileName); // השם המעודכן
    formData.append('extention', extension); // הסיומת (למקרה שהשרת דורש)
  
    return this.http.post(
      `${this.serverUrl}/upload-image`,
      formData,
      this.userService.getAuthHeaders()
    );
  }

  
  private cleanFileName(originalName: string): string {
    const nameWithoutExtension = originalName.split('.').slice(0, -1).join('.');
    return nameWithoutExtension
      .toLowerCase()
      .replace(/[^a-z0-9]/g, ''); // מסיר כל תו שהוא לא אות או מספר
  }
  
  

  // מחיקת תבנית
  deleteTemplate(template: TemplateDto): Observable<void> {
    const encodedFileName = encodeURIComponent(template.fileName); // זה פותר בעיות של תווים מיוחדים
    console.log(`${this.serverUrl}/delete-template/${encodedFileName}`);
    
    return this.http.delete<void>(`${this.serverUrl}/delete-template/${encodedFileName}`, this.userService.getAuthHeaders());
  }
}