import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loading = false;
  errors = {status: false, message: null};
  loginForm: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.loginForm = formBuilder.group({
      email: '',
      password: ''
    });
  }

  ngOnInit(): void {
  }
  onSubmit(): void {
   this.resetErrors();
   const email = this.loginForm.get('email').value;
   const password = this.loginForm.get('password').value;
   console.log(email, password);
   if (!email || !password) {
      this.errors.status = true;
      this.errors.message = 'Veuillez renseigner tous les champs svp';
      return;
    }
   this.loading = true;
  }
  resetErrors(): void {
    this.errors.status = false;
    this.errors.message = null;
  }

}
