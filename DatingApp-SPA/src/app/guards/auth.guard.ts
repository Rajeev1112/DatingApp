import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { AltertifyService } from '../_services/altertify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  /**
   *
   */
  constructor(private authService: AuthService, private router: Router, private alertify: AltertifyService) {}

  canActivate(): boolean {
    if (this.authService.loggedin()){
      return true;
    }
    this.router.navigate(['/home']);
    this.alertify.error('You can not do this!!!');
    return false;
  }
}
