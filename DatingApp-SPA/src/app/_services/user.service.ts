import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../_models/User';
import { PaginatedResult } from '../_models/Pagination';
import { map } from 'rxjs/operators';
import { Message } from '../_models/Message';


@Injectable({
  providedIn: 'root'
})
export class UserService {
baseUrl = environment.baseUrl;

constructor(private http: HttpClient) { }

getUsers(pageNumber?, pageSize?, userParam?, likesParam?): Observable<PaginatedResult<User[]>> {
   const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
   let param = new HttpParams();
   if (pageNumber != null && pageSize != null) {
    param = param.append('pageNumber', pageNumber);
    param = param.append('pageSize', pageSize);
   }
   if (userParam != null) {
     param = param.append('minAge', userParam.minAge);
     param = param.append('maxAge', userParam.maxAge);
     param = param.append('gender', userParam.gender);
     param = param.append('orderBy', userParam.orderBy);
   }
   if (likesParam === 'liker') {
     param = param.append('liker', 'true');
   }
   if (likesParam === 'likee') {
    param = param.append('likee', 'true');
  }
    return this.http.get<User[]>(this.baseUrl + 'user', {observe: 'response', params: param})
    .pipe(
      map( response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination')) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        }
      )
    );
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

sendLike(userId: number, recipientId: number) {
  return this.http.post(this.baseUrl + 'user/' + userId + '/like/' + recipientId, {});
}

getMessages(userId?, pageNumber?, pageSize?, messageContainer?) {
  const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();

   let param = new HttpParams();
   param = param.append('messageContainer', messageContainer);
   if (pageNumber != null && pageSize != null) {
    param = param.append('pageNumber', pageNumber);
    param = param.append('pageSize', pageSize);
   }

   return this.http.get<Message[]>(this.baseUrl + 'user/' + userId + '/messages', {observe: 'response', params: param})
            .pipe( map(response => {
              paginatedResult.result = response.body;
              if (response.headers.get('Pagination') != null){
                paginatedResult.pagination = JSON.parse( response.headers.get('Pagination'));
              }
              return paginatedResult;
            }));

}

getMessageThread(userId?, recipientId?) {
  return this.http.get<Message[]>(this.baseUrl + 'user/' + userId + '/messages/thread/' + recipientId);
}

sendMessage(userId: number, message: Message)
{
  return this.http.post(this.baseUrl + 'user/' + userId + '/messages', message);
}

deleteMessage(messageId: number, userId: Number) {
  return this.http.post(this.baseUrl + 'user/' + userId + '/messages/' + messageId, {});
}

markMessageAsRead(messageId: number, userId: Number) {
  return this.http.post(this.baseUrl + 'user/' + userId + '/messages/' + messageId + '/read', {}).subscribe();
}

}
