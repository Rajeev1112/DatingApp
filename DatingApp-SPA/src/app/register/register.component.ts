import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { error } from 'protractor';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegistration = new EventEmitter();

  model: any = {};

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  register() {
    this.auth.register(this.model).subscribe(() =>{
      console.log('Registration Successful');
    }, er => {
      console.log(er);
    });
  }

  cancel() {
    this.cancelRegistration.emit(false);
    console.log('Cancelled');
  }

}
