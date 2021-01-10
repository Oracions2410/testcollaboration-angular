import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, Router, Params} from '@angular/router';
import {MediaService} from '../../services/media.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loading = false;
  errors = {status: false, message: null};
  loginForm: FormGroup;
  constructor(
      private formBuilder: FormBuilder,
      private authService: AuthService,
      private mediaService: MediaService,
      private router: Router,
      private activatedRoute: ActivatedRoute,
      ) {
    this.loginForm = formBuilder.group({
      email: '',
      password: ''
    });
  }

  ngOnInit(): void {
      this.authService.message.subscribe(message => {
          this.errors.status = true;
          this.errors.message = message;
          setTimeout(() => this.resetErrors(), 5000);
      });
      if (this.router.url.includes('/google/auth')) {
          this.loading = true;
          this.activatedRoute.queryParams.subscribe(async (params: Params) => {
              const response = await this.authService.GetProfile(params.token).toPromise();

              if (response.status === 200) {
                  this.mediaService.playSound('opening');
                  this.authService.AttemptLogin(params.token, params.google_id);
                  this.redirectToHome();
              }
          });
      }
      if (this.authService.isAuthenticate()) {
        this.redirectToHome();
      }
  }


  redirectToHome(): void {
      this.router.navigateByUrl('/home');
  }

    /**
     * Submit user Login with credentials
     */
  async onSubmit(): Promise<void> {
   this.resetErrors();
   const email = this.loginForm.get('email').value;
   const password = this.loginForm.get('password').value;
   console.log(email, password);
   if (!email || !password) {
       this.mediaService.playSound('error');
       this.errors.status = true;
       this.errors.message = 'Veuillez renseigner tous les champs svp';
       return;
    }
   this.loading = true;
   const response = await this.authService.Login(email, password).toPromise()
       .catch(res => {
           this.mediaService.playSound('error');
           this.errors.status = true;
           this.errors.message = res.error.message;
       });

   if (response) {
        this.mediaService.playSound('opening');
        localStorage.setItem(this.authService.TOKEN_KEY, response.body.data.token);
        this.router.navigateByUrl('/home');
   }
   this.loading = false;

  }

    /**
     * Reset Form values
     */
  resetErrors(): void {
    this.errors.status = false;
    this.errors.message = null;
  }

  googleLogin(): void {
    this.authService.GoogleLogin();
  }

}
