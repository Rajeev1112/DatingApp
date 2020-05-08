import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/Message';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination } from '../_models/Pagination';
import { AltertifyService } from '../_services/altertify.service';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';
  constructor(private userService: UserService, private auth: AuthService, private route: ActivatedRoute, 
    private alertify: AltertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(x => {
      this.messages = x['messages'].result;
      this.pagination = x['messages'].pagination;
    });
  }

  loadMessages() {
    this.userService.getMessages(this.auth.decodedToken.nameid, this.pagination.CurrentPage,
      this.pagination.PageSize, this.messageContainer)
      .subscribe(next => {
        this.messages = next.result;
        this.pagination = next.pagination;
      }, err => {
        this.alertify.error(err);
      });
  }

  pageChanged(myEvent: any) {
    this.pagination.CurrentPage = myEvent.page;
    this.loadMessages();
  }

  deleteMessage(messageId: number) {
    this.alertify.confirm('Are you sure you want to delete this message?', () => {
      this.userService.deleteMessage(messageId, this.auth.decodedToken.nameid).subscribe(() => {
        this.messages.splice(this.messages.findIndex(x => x.id === messageId), 1);
        this.alertify.success('Message has been deleted');
      }, err => {
        this.alertify.error(err);
      });
    });
  }

}
