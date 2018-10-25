import { Component, OnInit, AfterViewInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { RegisterService } from '../register/register.service';
import { Router, ActivatedRoute } from '../../../../node_modules/@angular/router';
import * as firebase from 'firebase';
import { VerifyService } from './verify.service';
import swal from 'sweetalert2';

@Component({
  selector: 'mg-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit, AfterViewInit {

  @ViewChild('recaptchaDiv') recaptchaDiv:ElementRef;

  windowRef: any;
  user: any = {};
  phoneVerified: boolean = false;
  emailVerified: boolean = false;
  smsSent: boolean = false;
  invalid: boolean = false;
  phone: string = '';
  test: Date = new Date();

  constructor(private reg: RegisterService, private router: Router, private verifyService: VerifyService, private route: ActivatedRoute, private renderer:Renderer2) { }

  ngOnInit() {
    let username = this.reg.getCurrentUser();
    if (username.length > 0) {    //Users landing from login page

      this.reg.getUserFromFirebase(username).subscribe(res => {
        this.user = res;
        this.phoneVerified = this.user.phoneVerified;
        this.emailVerified = this.user.emailVerified;
        this.phone = this.user.phone;

      });
    } else {
      this.route.queryParamMap.subscribe(params => {   //Users landing from email link
        let uid = params.get('uid');
        let username = params.get('username');
        if (username && username.length > 0) {
          this.reg.setCurrentUser(username);
          this.reg.emailVerified(uid, username).subscribe(data => {

            this.reg.getUserFromFirebase(username).subscribe(res => {
              if (Object.keys(res).length === 0) {
                this.invalid = true;
              } else {
                this.user = res;

                this.phoneVerified = this.user.phoneVerified;
                this.emailVerified = true;    //As we know this came from the email link
                this.phone = this.user.phone;
              }
            })
          });

        } else {
          this.invalid = true;    //Users trying to access verify page through URL
        }
      })
    }
  }

  ngAfterViewInit() {
    if (!this.phoneVerified) {
      this.renderRecaptcha();
    }
  }

  renderRecaptcha() {
    this.windowRef = this.reg.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'normal'
    });
    this.windowRef.recaptchaVerifier.render();
  }

  gotoLogin() {
    this.router.navigate(['/login']);
  }

  resendOtp() {
    if (this.phone.length === 0) {
      swal('Oops', 'There was a problem fetching your mobile number', 'error');
    } else {
      const appVerifier = this.windowRef.recaptchaVerifier;
      firebase.auth().signInWithPhoneNumber(this.phone, appVerifier)
        .then((result) => {
          this.windowRef.confirmationResult = result;
          if (this.windowRef.confirmationResult) {
            this.smsSent = true;
          }
        })
        .catch((error) => {
          console.log(error)
          swal(
            'Oops...',
            error.message,
            'error'
          )
        });
    }
  }

  verifyOtp(code) {
    let self = this;
    this.windowRef.confirmationResult.confirm(code)
      .then((result) => {
        swal({
          type: 'success',
          title: 'You have successfully registered with your phone number !'
        });
        self.phoneVerified = true;
        self.route.queryParamMap.subscribe(params => {   //Users landing from email link
          let username = params.get('username');
          self.reg.phoneVerified(username).subscribe(data => { });
        });
      })
      .catch((error) => {
        swal({
          type: 'error',
          title: 'Could not register with the provided phone number !'
        });
      })
  }

  reSend(){
    
    this.windowRef.recaptchaVerifier.clear();
    this.renderRecaptcha();
    this.smsSent = false;
    // window.location.reload();
  }
}
