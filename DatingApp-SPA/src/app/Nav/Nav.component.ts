import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AltertifyService } from '../_services/altertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-Nav',
  templateUrl: './Nav.component.html',
  styleUrls: ['./Nav.component.css']
})
export class NavComponent implements OnInit {

  photoUrl: string;

  model: any = {

  };

  constructor(public authService: AuthService, private alertifyService: AltertifyService,
    private router: Router) { }

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(p => this.photoUrl = p);
  }

  login(): void {
    this.authService.login(this.model).subscribe(next => {
      this.alertifyService.success('Login Sucessful');
    }, error => {
      this.alertifyService.error(error);
    }, () => {
      this.router.navigate(['/members']);
    });
  }

  loggedIn() {
    // const token = localStorage.getItem('token');
    // return !!token;
    return this.authService.loggedin();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.authService.currUser = null;
    this.alertifyService.message('Logged Out');
    this.router.navigate(['/home']);
  }

}
