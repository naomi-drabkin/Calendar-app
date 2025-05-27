import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { User } from '../../models/User';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-users',
  imports: [
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule

  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {
  users: User[] = [];
  data!: FormGroup;
  openModal: boolean = false;
  idUser: number = 0;
  add_User: boolean = false;
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  isLoading = false;


  constructor(private userService: UsersService,
    private authService: AuthService,
    private fb: FormBuilder,
    public dialog: MatDialog

  ) {

    this.data = this.fb.group({
      userName: ['', Validators.required],
      userFamily: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      role: [''],

    });
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.getAllUsers()?.subscribe({
      next: (data) => {
        this.users = data.filter(d => d.email !== this.authService.getAdminEmail()),
          console.log("data = " + data)
        console.log(data);
      },

      error: (err) => console.error('שגיאה בטעינת משתמשים:', err)
    });
  }

  deleteUser(id: number) {
    this.isLoading = true;

    if (confirm('האם אתה בטוח שברצונך למחוק את המשתמש?')) {
      console.log("אני בטוח!!!!!! 'האם אתה בטוח שברצונך למחוק את המשתמש?'");
      console.log(id);
      console.log("אני בטוח!!!!!! 'האם אתה בטוח שברצונך למחוק את המשתמש?'");

      this.userService.deleteUser(id).subscribe({
        next: () => {
          console.log("user delete successfully");
          this.users = this.users.filter(u => u.id !== id);
          this.isLoading = false;
        },
        error: (err) => {
          alert('שגיאה במחיקה: ' + err.error),
          this.isLoading = false;
        }
      });
    }
  }

  updateUser(id: number) {
    this.isLoading = true;
    const model = this.data.value;

    const user: User = {
      id: id,
      ...model
    };

    this.userService.updateUser(id, user).subscribe({
      next: () => {
        console.log("user update successfully");
        this.isLoading = false;
        this.fetchUsers();
      },
      error: (err) => {alert('שגיאה בעדכון: ' + err.error),this.isLoading = false;}
    });

    this.data.reset();
  }

  addUser() {
    this.isLoading = true;
    const model = this.data.value;

    const user: User = {
      ...model,
      'role': "User"
    };

    this.userService.addUser(user).subscribe({
      next: () => {
        console.log("user add successfully");
        this.isLoading = false;
        this.fetchUsers();
      },
      error: (err) => {alert('שגיאה בהוספה: ' + err.error),this.isLoading = false; }
    });
    this.data.reset();
    this.dialog.closeAll();
  }

  openDialog(): void {
    this.dialog.open(this.dialogTemplate, {
      width: '400px'
    });
  }

  onSubmit(id: number): void {
    if (this.data.valid) {
      console.log('נשלח:', this.data.value);
      this.updateUser(id);
      this.dialog.closeAll();
    }
  }
}