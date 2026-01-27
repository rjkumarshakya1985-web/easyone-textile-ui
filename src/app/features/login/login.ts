import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { LoginRequest } from '../../model/login.model';
import { AppUser } from '../../model/app-user.model';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../core/services/loader.service';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
    CheckboxModule,
    ProgressSpinnerModule,
    CommonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
  providers: [MessageService],
})
export class Login {
  rememberMe: boolean = false;
  username: string = '';
  password: string = '';

  constructor(
    private loader: LoaderService,
    private authService: AuthService,         // SAVE TOKEN
    private messageService: MessageService,
    private localstorageService :LocalStorageService,
    private router: Router
  ) {}

  login() {

    if (!this.username || !this.password) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Missing Fields',
        detail: 'Please enter username and password'
      });
      return;
    }

    const data: LoginRequest = {
      userName: this.username,
      password: this.password,
      clientType :0
    };

    this.loader.show();
    this.authService.login(data).subscribe({
      next: (user :AppUser) => {
         
         
         this.loader.hide();
         if(!user.isLoginFailed)
         {
           this.messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: user.message,
             life: 5000
            });
            return; 
         }
         this.localstorageService.setUser(user);
         this.localstorageService.setTokens(user.token,user.refreshToken);
        
        if (this.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }

       
        if (user.roleName === 'Supplier') {
          this.router.navigate(['/supplier']);
        } 
        else if (user.roleName === 'SuperAdmin') {
          this.router.navigate(['/admin']);
        } 
       
      }
    });
  }
}
