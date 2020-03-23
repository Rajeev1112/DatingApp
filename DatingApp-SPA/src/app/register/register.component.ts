import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { error } from 'protractor';
import { AltertifyService } from '../_services/altertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegistration = new EventEmitter();

  model: any = {};

  constructor(private auth: AuthService, private alertify: AltertifyService) { }

  ngOnInit() {
  }

  register() {
    this.auth.register(this.model).subscribe(() => {
      this.alertify.success('Registration Successful');
    }, er => {
      this.alertify.error(er);
    });
  }

  cancel() {
    this.cancelRegistration.emit(false);
  }

}
