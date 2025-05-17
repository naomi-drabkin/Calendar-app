import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5204/api/User';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    console.log("in authService before login");
    console.log("*********");
    
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
    console.log(decoded);
    console.log("decoded = " + decoded);
    console.log(decoded);
    
    

    const roles = decoded['roles'] || [];

    console.log("role = " + roles);
    return Array.isArray(roles) ? roles : [roles];    
    // if (role) return decoded.role;
    // if (role && decoded.roles.length > 0) return decoded.roles[0];
    // return [];
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