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
import Swal from 'sweetalert2';

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
        this.users = data.filter(d => d.email !== this.authService.getAdminEmail())
      },

      error: (err) => console.error('שגיאה בטעינת משתמשים:', err)
    });
  }

  deleteUser(id: number) {
    Swal.fire({
      title: 'מחיקת משתמש',
      text: 'האם אתה בטוח שברצונך למחוק את המשתמש?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#5c6bc0',
      cancelButtonColor: '#757575',
      confirmButtonText: 'כן',
      cancelButtonText: 'ביטול'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
  
        this.userService.deleteUser(id).subscribe({
          next: () => {
            this.users = this.users.filter(u => u.id !== id);
            this.isLoading = false;
          },
          error: (err) => {
            Swal.fire({
              title: 'שגיאה',
              text: 'שגיאה במחיקה',
              icon: 'error',
              confirmButtonText: 'אישור',
              confirmButtonColor: '#2575fc'
            });
            this.isLoading = false;
          }
        });
      } else {
        console.log("מחיקה בוטלה ע״י המשתמש");
      }
    });
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
        this.isLoading = false;
        this.fetchUsers();
      },
      error: (err) => {
        Swal.fire({
          title: 'שגיאה',
          text: 'שגיאה בעדכון',
          icon: 'error',
          confirmButtonText: 'אישור',
          confirmButtonColor: '#2575fc'
        }),
          this.isLoading = false;
      }
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
        this.isLoading = false;
        this.fetchUsers();
      },
      error: (err) => {
        Swal.fire({
          title: 'שגיאה',
          text: 'שגיאה בהוספה',
          icon: 'error',
          confirmButtonText: 'אישור',
          confirmButtonColor: '#2575fc'
        }),
          this.isLoading = false;
      }
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
      this.updateUser(id);
      this.dialog.closeAll();
    }
  }
}