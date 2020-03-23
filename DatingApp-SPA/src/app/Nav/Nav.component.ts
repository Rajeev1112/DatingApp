import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AltertifyService } from '../_services/altertify.service';

@Component({
  selector: 'app-Nav',
  templateUrl: './Nav.component.html',
  styleUrls: ['./Nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {

  };

  constructor(public authService: AuthService, private alertifyService: AltertifyService) { }

  ngOnInit() {
  }

  login(): void {
    this.authService.login(this.model).subscribe(next => {
      this.alertifyService.success('Login Sucessful');
    }, error => {
      this.alertifyService.error(error);
    });
  }

  loggedIn() {
    // const token = localStorage.getItem('token');
    // return !!token;
    return this.authService.loggedin();
  }

  logout() {
    localStorage.removeItem('token');
    this.alertifyService.message('Logged Out');
  }

}
