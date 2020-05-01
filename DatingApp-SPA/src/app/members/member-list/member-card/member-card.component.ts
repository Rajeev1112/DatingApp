import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/User';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AltertifyService } from 'src/app/_services/altertify.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
@Input() myUser: User;

  constructor(private authService: AuthService, private userService: UserService, private alertifyService: AltertifyService) { }

  ngOnInit() {
  }

  sendLike(id: number) {
    this.userService.sendLike(this.authService.decodedToken.nameid, id).subscribe(x => {
      this.alertifyService.success('You successfully liked : ' + this.myUser.knownAs);
    }, err => {
      this.alertifyService.error('You already liked this user');
    });
  }

}
