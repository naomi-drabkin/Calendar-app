
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-auth',
  imports: [
    FormsModule,
    HttpClientModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  email = '';
  password = '';
  isLoading = false;


  constructor(private authService: AuthService, private router: Router) { }

  login() {
    this.isLoading = true; 

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        console.log("in auth components in next after login");
        console.log(res.token);

        localStorage.setItem('token', res.token);
        console.log(this.authService.getUserRole());
        const isAdmin = this.authService.isAdmin();
        console.log("in auth components in next after login 2");
        console.log("isAdmin = " + isAdmin);
        if (!isAdmin) {
          alert("לא ניתן להתחבר למערכת");
          localStorage.removeItem('token');
          return;
        }
        localStorage.setItem('isLoggedIn', 'true');
        this.router.navigate(['/users']);
        this.isLoading = false;
      },
      error: (err) => {
        alert('שגיאה בהתחברות: ' + err.error);
        this.isLoading = false;
      }
    });
  }
}