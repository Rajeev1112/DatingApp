import { Component, OnInit } from '@angular/core';
import { User } from '../_models/User';
import { Pagination, PaginatedResult } from '../_models/Pagination';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AltertifyService } from '../_services/altertify.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  likesParam: string;

  constructor( private auth: AuthService, private userService: UserService,
    private route: ActivatedRoute, private alertify: AltertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(x => {
      this.users = x['users'].result;
      this.pagination = x['users'].pagination;
    });
    this.likesParam = 'liker';
  }

  loadUsers() {
    this.userService.getUsers(this.pagination.CurrentPage, this.pagination.PageSize, null, this.likesParam).
    subscribe((res: PaginatedResult<User[]>) => {
      this.users = res.result;
      this.pagination = res.pagination;
    }, error => this.alertify.error(error));
  }

  pageChanged(event: any): void {
    this.pagination.CurrentPage = event.page;
    this.loadUsers();
  }

}
