import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  usernameError: boolean = false;
  passwordError: boolean = false;
  loginError: string = '';

  constructor(private router: Router) {}

  Login(UserName: string, Password: string) {
    this.usernameError = false;
    this.passwordError = false;
    this.loginError = '';

    // ✅ Hardcoded credentials
    if (UserName === 'psladmin' && Password === 'psladmin!23') {
      this.router.navigate(['/home']);
    } else {
      this.loginError = 'Invalid username or password!';
      this.usernameError = UserName !== 'psladmin';
      this.passwordError = Password !== 'psladmin!23herded pded';
    }
  }
}
