import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import * as firebase from 'firebase';
import { environment } from '../../../environments/environment.prod';
import swal from 'sweetalert2';

@Component({
  selector: 'mg-forgot-password',
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent implements OnInit {


  test: Date = new Date();

  ngOnInit() {
  }

  public resetPwdForm: FormGroup;

  constructor(private element: ElementRef, fb: FormBuilder) {

    this.resetPwdForm = fb.group({
      'email': ['', Validators.compose([Validators.required, CustomValidators.email])],
    });
  }

  resetPassword(email: string){
    let auth = firebase.auth();
    let actionCodeSettings = {
      url: environment.url + '/#/login'
    };
    
    auth.sendPasswordResetEmail(email, actionCodeSettings).then(function() {
      // Email sent.      
      swal('Success', 'Password reset link sent succesfully. Please check your email!', 'success');
    }).catch(function(error) {      
      // An error happened.
      if(error['code'] === 'auth/user-not-found'){
        swal('User not found', 'There is no user record corresponding to this email. The user may have been deleted.', 'error');
      } else {
        swal('Oops...', error['message'], 'error');
      }
    });
  }

}
