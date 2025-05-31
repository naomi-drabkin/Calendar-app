import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { _http } from '../app/app.component';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${_http}/api/User`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {

    
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('isLoggedIn', 'true');
  }

  getUserRole(): string[] {
    const token = localStorage.getItem('token');
    if (!token) return [];

    const decoded:any = jwtDecode(token); 
    const roles = decoded['roles'] || [];

    return Array.isArray(roles) ? roles : [roles];    

  }

  isAdmin(): boolean {

    return this.getUserRole().includes('Admin') ||this.getUserRole().includes('admin')  ;
  }

  getAdminEmail():string | null{
    const token = localStorage.getItem('token');
    if (!token) return  null;

    const decoded:any = jwtDecode(token);
    return decoded['Email'];

  }

}