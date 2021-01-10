import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  BASE_API = `${environment.api}/api`;
  TOKEN_KEY = 'DzPXKpLeac6dgDaq5ALA3YK6v5jeWVJRbVcVSp6zgGahZkK9ex';
  message = new Subject<string>();

  constructor(private http: HttpClient) { }

  /**
   * Credentials user login
   * @param email, user address
   * @param password, user password
   */
  Login(email: string, password: string): Observable<any> {
    return this.http.post(
        `${this.BASE_API}/login`,
        {email, password},
        { observe: 'response'}
        );
  }

  /**
   * Login with google account
   */

  GoogleLogin(): void {
    console.log('...');
    window.location.href = `${environment.api}/google/redirect`;
  }

  /**
   * Create new user account
   * @param email, email address
   * @param name, user name
   * @param password, user input password
   * @param cPassword, user input confirm password
   */
  Register(email, name, password, cPassword): Observable<any> {
    return this.http.post(
        `${this.BASE_API}/register`,
        {email, name, password, c_password: cPassword}
        );
  }

  /**
   * Check if user is already authenticate
   */
  isAuthenticate(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  AttemptLogin(token, googleId): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Logout an authenticated user
   */
  Logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Test if token provided is valid
   * @param token, user access token
   */
  GetProfile(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${environment.api}/api/users/profile`, {
      observe: 'response',
      headers
    });
  }

  /**
   * Delete connected user accont
   */
  DeleteAccount(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem(this.TOKEN_KEY)}`
    });
    this.Logout();
    this.message.next('Votre compte a bien supprimé.');
    return this.http.delete(`${environment.api}/api/users`, { headers });
  }

}
