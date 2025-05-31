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
  private serverUrl = `${_http}/api/templates`; 
  private downloadUrl = `${_http}/api/upload`; 


  constructor(private http: HttpClient,
    private userService: UsersService
  ) {}

  getDownloadUrl(fileName: string): Observable<string> {
    return this.http.get(`${this.downloadUrl}/download-url/${fileName}`, {
      responseType: 'text'
    });
  }

  getAllTemplates(): Observable<TemplateDto[]> {
    return this.http.get<TemplateDto[]>(`${this.serverUrl}/get-all-templates`);
  }

  uploadFile(file: File): Observable<any> {
    const cleanFileName = this.cleanFileName(file.name);
    const extension = file.name.split('.').pop()?.toLowerCase() || 'png';
    const randomId = Math.random().toString(36).substring(2, 8);
    const finalFileName = `${cleanFileName}${randomId}.${extension}`;
  
    const formData = new FormData();
    const sanitizedFile = new File([file], finalFileName, { type: file.type });
  
    formData.append('file', sanitizedFile); 
    formData.append('fileName', finalFileName);
    formData.append('extention', extension); 
  
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
      .replace(/[^a-z0-9]/g, ''); 
  }
  
  

  deleteTemplate(template: TemplateDto): Observable<void> {
    const encodedFileName = encodeURIComponent(template.fileName); 
    return this.http.delete<void>(`${this.serverUrl}/delete-template/${encodedFileName}`, this.userService.getAuthHeaders());
  }
}