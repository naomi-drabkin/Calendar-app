import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UsersService } from './users.service';
import { TemplateDto } from '../models/TemplateDto';


@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private serverUrl = 'http://localhost:5204/api/templates'; // עדכן לפי כתובת ה-API שלך
  private downloadUrl = 'http://localhost:5204/api/upload'; // עדכן לפי כתובת ה-API שלך


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
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); // זה הקובץ עצמו
    formData.append('fileName', file.name); // זה השם שהשרת דורש
    formData.append('extention', file.name.split('.').pop() || ''); // זה הסיומת של הקובץ


    return this.http.post(
      `${this.serverUrl}/upload-image`,
      formData,
      this.userService.getAuthHeaders() // אם את משתמשת באותנטיקציה
    );
  }

  // מחיקת תבנית
  deleteTemplate(template: TemplateDto): Observable<void> {
    const encodedFileName = encodeURIComponent(template.fileName); // זה פותר בעיות של תווים מיוחדים
    console.log(`${this.serverUrl}/delete-template/${encodedFileName}`);
    
    return this.http.delete<void>(`${this.serverUrl}/delete-template/${encodedFileName}`, this.userService.getAuthHeaders());
  }
}