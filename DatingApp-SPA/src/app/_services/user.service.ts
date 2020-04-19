import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../_models/User';


@Injectable({
  providedIn: 'root'
})
export class UserService {
baseUrl = environment.baseUrl;

constructor(private http: HttpClient) { }

getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + 'user');
}

getUser(id): Observable<User> {
  return this.http.get<User>(this.baseUrl + 'user/' + id);
}

updateUser(id: number, user: User) {
  return this.http.put(this.baseUrl + 'user/' + id, user);
}

setMainPhoto(userId: number, id: number) {
  return this.http.post(this.baseUrl + 'user/' + userId + '/photos/' + id + '/SetMain', {});
}

deletePhoto(userId: number, photoId: number) {
  return this.http.delete(this.baseUrl + 'user/' + userId + '/photos/' + photoId);
}


}
