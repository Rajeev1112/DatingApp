import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import { registerContentQuery } from '@angular/core/src/render3/instructions';
import {JwtHelperService} from '@auth0/angular-jwt';
import { User } from '../_models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

baseUrl = 'http://localhost:5000/api/auth/';
decodedToken: any;
jwtHelper = new JwtHelperService();
currUser: User;
photoUrl = new BehaviorSubject<string>('../../assets/User.png');
currentPhotoUrl = this.photoUrl.asObservable();

changeMemberPhoto(url: string) {
  this.photoUrl.next(url);
}

constructor(private http: HttpClient) { }

login(model: any) {

  return this.http.post(this.baseUrl + 'login', model).pipe(map((response: any) => {
      const user = response;
      if (user) {
        localStorage.setItem('token', user.token);
        localStorage.setItem('user', JSON.stringify(user.currUser));
        this.decodedToken = this.jwtHelper.decodeToken(user.token);
        this.currUser = user.currUser;
        this.changeMemberPhoto(user.currUser.photoUrl);
      }
  }));

}

register(model: any) {

  return this.http.post(this.baseUrl + 'register', model);

}

loggedin() {
  const token = localStorage.getItem('token');
  return !this.jwtHelper.isTokenExpired(token);
}

}
