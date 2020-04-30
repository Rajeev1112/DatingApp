import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/User';
import { UserService } from '../../_services/user.service';
import { AltertifyService } from '../../_services/altertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from 'src/app/_models/Pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[];
  userLoggedIn: User = JSON.parse(localStorage.getItem('user'));
  pagination: Pagination;
  genderList = [{value: 'male', display: 'Male'}, {value: 'female', display: 'Female'}];
  userparam: any = {};

  constructor(private user: UserService, private alertify: AltertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(d => {
      this.users = d['users'].result;
      this.pagination = d['users'].pagination;
    });

    this.userparam.gender = this.userLoggedIn.gender === 'male' ? 'female' : 'male';
    this.userparam.minAge = 18;
    this.userparam.maxAge = 99;
    this.userparam.orderBy = 'lastActive';
  }

  pageChanged(event: any): void {
    this.pagination.CurrentPage = event.page;
    this.loadUsers();
  }

  resetFiler() {
    this.userparam.gender = this.userLoggedIn.gender === 'male' ? 'female' : 'male';
    this.userparam.minAge = 18;
    this.userparam.maxAge = 99;
    this.loadUsers();
  }

  loadUsers() {
    this.user.getUsers(this.pagination.CurrentPage, this.pagination.PageSize, this.userparam).subscribe((res: PaginatedResult<User[]>) => {
      this.users = res.result;
      this.pagination = res.pagination;
    }, error => this.alertify.error(error));
  }

}
