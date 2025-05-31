import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { _http } from '../app/app.component';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = `${_http}/api/User`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, this.getAuthHeaders());
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  updateUser(id:number,user:User): Observable<any> {
    
    return this.http.put(`${this.apiUrl}/${id}`, user, this.getAuthHeaders());
  }

  
  addUser(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user, this.getAuthHeaders());
  }

  public getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({ Authorization:`Bearer ${token}` })
    };
  }
}