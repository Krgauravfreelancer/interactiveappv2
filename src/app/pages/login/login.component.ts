import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { RegisterService } from '../register/register.service';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import swal from 'sweetalert2';

declare var $: any;

@Component({
    selector: 'app-login-cmp',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {
    test: Date = new Date();
    private toggleButton: any;
    public loginForm: FormGroup;

    constructor(private element: ElementRef, fb: FormBuilder, private loginService: LoginService, private router: Router, private reg: RegisterService) {

        this.loginForm = fb.group({
            'email': ['', Validators.compose([Validators.required, CustomValidators.email])],
            'password': ['', Validators.compose([Validators.required])]
        });
    }

    ngOnInit() {
        setTimeout(function () {
            // after 1000 ms we add the class animated to the login/register card
            $('.card').removeClass('card-hidden');
        }, 700);
    }

    login(userCred) {
        this.loginService.getUserFromFirebase(userCred.email).subscribe(user => {
            if (Object.keys(user).length > 0) {
                this.reg.setCurrentUser(user.username);
                if (!user['phoneVerified'] || !user['emailVerified']) {
                    this.router.navigate(['/verify'], { queryParams: { username: user.username } });
                } else {
                    firebase.auth().signInWithEmailAndPassword(userCred.email, userCred.password).then(res => {
                        firebase.auth().currentUser.getIdToken(true).then(function (idToken) {                            
                            localStorage.setItem('idToken', idToken);
                        }).catch(function (error) {
                            swal('Invalid Token', 'Please re-login', 'error');
                        });
                        if(user['userType'] === 'admin'){
                            localStorage.setItem('al', '3486')    //Setting admin level - User is identified as admin if value is 3486
                        } else {
                            localStorage.setItem('al', Math.floor((Math.random() * 999) + 1).toString());   //To create randomness preventing hack.
                        }
                        localStorage.setItem('user', JSON.stringify(res));
                        this.loginService.login();
                        this.router.navigate(['/dashboard']);
                    }).catch(err => {
                        swal('Login Failed', err.message, 'error');
                    })
                }
            } else {
                swal('Login Failed', 'Invalid Credentials!', 'error');
            }
        })
        // this.loginService.login(val).then(res=>{

        // })

    }
}
