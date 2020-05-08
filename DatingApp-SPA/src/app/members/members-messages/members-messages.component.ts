import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/_models/Message';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AltertifyService } from 'src/app/_services/altertify.service';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-members-messages',
  templateUrl: './members-messages.component.html',
  styleUrls: ['./members-messages.component.css']
})
export class MembersMessagesComponent implements OnInit {
  @Input() recipeientId: number;
  messages: Message[];
  newMessage: any = {};
  constructor(private auth: AuthService, private userService: UserService, private altertify: AltertifyService) { }

  ngOnInit() {
    this.loadMessageThread();
  }

  loadMessageThread() {
    this.userService.getMessageThread(this.auth.decodedToken.nameid, this.recipeientId)
    .pipe(
      tap(messages => {
        debugger;
        for (let index = 0; index < messages.length; index++) {
          if (!messages[index].IsRead && messages[index].recipientId === +this.auth.decodedToken.nameid) {
            this.userService.markMessageAsRead(messages[index].id, this.auth.decodedToken.nameid);
          }

        }
      })
    )
    .subscribe(messages => {
      this.messages = messages;
    }, err => {
      this.altertify.error(err);
    });
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipeientId;
    this.userService.sendMessage(this.auth.decodedToken.nameid, this.newMessage).subscribe((msg: Message) => {
      debugger;
      this.messages.unshift(msg);
      this.newMessage.content = '';
    }, err => {
      this.altertify.error(err);
    });
  }

}
