import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_models/User';
import { ActivatedRoute } from '@angular/router';
import { AltertifyService } from 'src/app/_services/altertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;
  user: User;
  photoUrl: string;
  @HostListener('window:beforeunload', ['$event'])

  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.retunValue = true;
    }
  }
  constructor(private route: ActivatedRoute, private alertify: AltertifyService,
    private userService: UserService, private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(x => {
      this.user = x['user'];
    });
    this.authService.currentPhotoUrl.subscribe(p => this.photoUrl = p);
  }

  updateUser() {
    this.userService.updateUser(this.authService.decodedToken.nameid, this.user).subscribe(next => {
      this.alertify.success('User profile successfully updated.');
      this.editForm.reset(this.user);
    }, error => this.alertify.error(error));
  }

  setMainPhoto(url) {
    this.user.photoUrl = url;
  }

}
