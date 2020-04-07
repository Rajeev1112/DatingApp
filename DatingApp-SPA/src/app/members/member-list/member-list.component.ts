import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/User';
import { UserService } from '../../_services/user.service';
import { AltertifyService } from '../../_services/altertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[];

  constructor(private user: UserService, private alertify: AltertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(d => {
      this.users = d['users'];
    });
  }

  // loadUsers() {
  //   this.user.getUsers().subscribe((users: User[]) => {
  //     this.users = users;
  //   }, error => this.alertify.error(error));
  // }

}
