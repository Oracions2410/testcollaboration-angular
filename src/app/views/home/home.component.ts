import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {MediaService} from '../../services/media.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user;

  loading = false;
  constructor(
    private authService: AuthService,
    private mediaService: MediaService,
    private router: Router,
  ) { }

  async ngOnInit(): Promise<void> {
    const response = await this.authService.GetProfile(localStorage.getItem(this.authService.TOKEN_KEY)).toPromise();
    this.user = response.body.data;
  }

  logout(): void {
    this.authService.Logout();
    this.mediaService.playSound('shutdown');
    this.router.navigateByUrl('/login');
  }

  async deleteAccount(): Promise<void> {
    await this.authService.DeleteAccount().toPromise();
    window.location.reload();
  }

}
