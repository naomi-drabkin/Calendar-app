import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { _http } from '../app/app.component';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = `${_http}/api/Email/api/send-email`; 
  private apiUrlGet = `${_http}/api/User/emails`; 

  constructor(private http: HttpClient,
            private userService: UsersService,
  ) { }

  getEmails(){
    return this.http.get(this.apiUrlGet,this.userService.getAuthHeaders() );
  }

  sendEmail(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  sendMessage(message: string) {
    return this.http.post<any>(`${_http}/api/openai/chat`, { message });
  }
 
}

