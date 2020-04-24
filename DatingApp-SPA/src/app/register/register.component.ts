import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { error } from 'protractor';
import { AltertifyService } from '../_services/altertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from '../_models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegistration = new EventEmitter();
  user: User;
  registerForm: FormGroup;
  bsDateConfig: Partial<BsDatepickerConfig>;

  constructor(private auth: AuthService,
              private alertify: AltertifyService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    this.bsDateConfig = {
      containerClass: 'theme-red'
    };
    this.createRegistrationForm();
  }

  createRegistrationForm() {
    this.registerForm = this.formBuilder.group({
      gender: ['male'],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {validator: this.passwordMatchValidator});
  }

  passwordMatchValidator(group: FormGroup) {
    return group.get('password').value === group.get('confirmPassword').value ? null : {missmatch : true};
  }

  register() {
    if (this.registerForm.valid) {
        this.user = Object.assign({}, this.registerForm.value);
        this.auth.register(this.user).subscribe(() => {
        this.alertify.success('Registration Successful');
        }, er => {
          this.alertify.error(er);
        }, () => {
          this.auth.login(this.user).subscribe(() => {
            this.router.navigate(['/members']);
          });
        });
    }
  }

  cancel() {
    this.cancelRegistration.emit(false);
  }

}
