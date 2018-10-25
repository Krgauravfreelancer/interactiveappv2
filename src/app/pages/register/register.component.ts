import { Component, OnInit, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CustomValidators } from 'ng2-validation';

import { RegisterService } from './register.service';

import * as firebase from 'firebase';
import swal from 'sweetalert2';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

declare const $: any;

@Component({
    selector: 'app-register-cmp',
    templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit, AfterViewInit {
    test: Date = new Date();

    public tradersRegForm: FormGroup;

    public firstname: AbstractControl;
    public lastname: AbstractControl;
    public email: AbstractControl;
    public phone: AbstractControl;
    public addressLine1: AbstractControl;
    public addressLine2: AbstractControl;
    public pincode: AbstractControl;
    public country: AbstractControl;
    public state: AbstractControl;
    public city: AbstractControl;
    public tradeExp: AbstractControl;
    public tradeFeq: AbstractControl;
    public interest: AbstractControl;
    public brokeAcc: AbstractControl;
    public username: AbstractControl;
    public password: AbstractControl;
    public confPass: AbstractControl;

    windowRef: any;
    userData: Observable<any[]>;

    public countryOptions = [];
    public countrySettings = {};
    public countrySelectedItem = [];

    public tradingExpOptions = [];
    public tradingExpSettings = {};
    public tradingExpSelectedItem = [];

    public tradingFeqOptions = [];
    public tradeFeqSettings = {};
    public tradeFeqSelectedItem = [];

    public brokeAccOptions = [];
    public brokeAccSettings = {};
    public brokeAccSelectedItem = [];

    public interestOptions = [];
    public interestSettings = {};
    public interestSelectedItems = [];

    public registrationComplete: boolean = false;
    public phoneVerified: boolean = false;
    currentUser: string = '';

    @ViewChild('confPass') confPassEle: ElementRef;
    recaptchaVerified: boolean = false;

    constructor(private reg: RegisterService, fb: FormBuilder, private router: Router) {

        this.tradersRegForm = fb.group({
            'firstname': ['', Validators.compose([CustomValidators.rangeLength([5, 30])])],
            'lastname': ['', Validators.compose([CustomValidators.rangeLength([3, 30])])],
            'email': ['', Validators.compose([CustomValidators.email])],
            'phone': ['', Validators.compose([CustomValidators.phone('IN'), CustomValidators.phone('OM')])],
            'addressLine1': ['', Validators.compose([Validators.required])],
            'addressLine2': ['', Validators.compose([Validators.required])],
            'pincode': ['', Validators.compose([CustomValidators.digits])],
            'country': ['', Validators.compose([CustomValidators.rangeLength([5, 50])])],
            'state': ['', Validators.compose([Validators.required])],
            'city': ['', Validators.compose([Validators.required])],
            'tradeExp': ['', Validators.compose([Validators.required])],
            'tradeFeq': ['', Validators.compose([Validators.required])],
            'interest': ['', Validators.compose([Validators.required])],
            'brokeAcc': ['', Validators.compose([Validators.required])],
            'username': ['', Validators.compose([Validators.required])],
            'password': ['', Validators.compose([Validators.required])],
            'confPass': ['', Validators.compose([Validators.required])]
        });



        this.firstname = this.tradersRegForm.controls['firstname'];
        this.lastname = this.tradersRegForm.controls['lastname'];
        this.email = this.tradersRegForm.controls['email'];
        this.phone = this.tradersRegForm.controls['phone'];
        this.addressLine1 = this.tradersRegForm.controls['addressLine1'];
        this.addressLine2 = this.tradersRegForm.controls['addressLine2'];
        this.pincode = this.tradersRegForm.controls['pincode'];
        this.country = this.tradersRegForm.controls['country'];
        this.state = this.tradersRegForm.controls['state'];
        this.city = this.tradersRegForm.controls['city'];
        this.tradeExp = this.tradersRegForm.controls['tradeExp'];
        this.tradeFeq = this.tradersRegForm.controls['tradeFeq'];
        this.interest = this.tradersRegForm.controls['interest'];
        this.brokeAcc = this.tradersRegForm.controls['brokeAcc'];
        this.username = this.tradersRegForm.controls['username'];
        this.password = this.tradersRegForm.controls['password'];
        this.confPass = this.tradersRegForm.controls['confPass'];

        this.countrySettings = {
            singleSelection: true,
            text: "Select Country Of Residence",
            enableSearchFilter: true
        }

        this.tradingExpSettings = {
            singleSelection: true,
            text: "How many years of trading experience do you have ?",
            enableSearchFilter: true
        }

        this.tradeFeqSettings = {
            singleSelection: true,
            text: "How many times do you trade each month ?",
            enableSearchFilter: true
        }

        this.interestSettings = {
            singleSelection: false,
            text: "What products are you interested in trading ? (Check as many that apply)",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            badgeShowLimit: 3,
            enableSearchFilter: true
        };

        this.brokeAccSettings = {
            singleSelection: true,
            text: "Do you have an existing brokerage account ?",
            enableSearchFilter: false
        }
    }

    ngOnInit() {
        this.reg.fetchAllCountries().subscribe((data) => {
            this.countryOptions = [];
            for (let obj of data) {
                this.countryOptions.push({
                    id: obj['code'],
                    itemName: obj['itemName']
                });
            }
        });

        this.tradingExpOptions = this.reg.getTradingExperience();
        this.tradingFeqOptions = this.reg.getTradeTimes();
        this.brokeAccOptions = this.reg.getBrokerageAccOption();
        this.interestOptions = this.reg.getInterest();
    }

    ngAfterViewInit() {

        // $.validator.addMethod('magnitudinisphone', function (value, element) {
        //     return this.optional(element) || /([0-9]{10})|(\([0-9]{3}\)\s+[0-9]{3}\-[0-9]{4})/.test(value);
        // }, "Please enter a valid phone number");

        const $validator = $(".wizard-card form").validate({
            rules: {
                firstname: { required: true, minlength: 5 },
                lastname: { required: true, minlength: 3 },
                email: {
                    required: true, minlength: 3, email: true, remote: {
                        // url: environment.url + "/auth/isEmailUnique",
                        url: "/auth/isEmailUnique",
                        type: "post",
                        data: {
                            email: function () {
                                return $("#email").val();
                            }
                        },
                        dataType: 'json'
                    }
                },
                phone: {
                    required: true,
                    // magnitudinisphone: true, 
                    remote: {
                        // url: environment.url + "/auth/isPhoneUnique",
                        url: "/auth/isPhoneUnique",
                        type: "post",
                        data: {
                            phone: function () {
                                return $('[name="phone"]').intlTelInput('getNumber');
                            }
                        },
                        dataType: 'json'
                    }
                },
                addressLine1: { required: true },
                addressLine2: { required: true },
                country: { required: true },
                state: { required: true },
                city: { required: true },
                pincode: { required: true, digits: true },
                username: {
                    required: true, remote: {
                        // url: environment.url + "/auth/isUsernameUnique",
                        url: "/auth/isUsernameUnique",
                        type: "post",
                        data: {
                            username: function () {
                                return $("#username").val();
                            }
                        },
                        dataType: 'json'
                    }
                },
                password: { minlength: 8 },
                confPass: { minlength: 8, equalTo: '#password' }
            }, messages: {
                email: { remote: "Email already registered! Please Login or use different email id." },
                phone: { remote: "Phone number already registered! Please Login or use different number." },
                username: { remote: "Username already taken! Please Login or choose a different username." }
            }
        });

        $('.wizard-card').bootstrapWizard({
            'tabClass': 'nav nav-pills',
            'nextSelector': '.btn-next',
            'previousSelector': '.btn-previous',

            onNext: function (tab: any, navigation: any, index: any) {
                const $valid = $('.wizard-card form').valid();
                if (!$valid) {
                    $validator.focusInvalid();
                    return false;
                }
            },

            onInit: function (tab: any, navigation: any, index: any) {

                $('[name="phone"]').intlTelInput();

                // check number of tabs and fill the entire row
                const $total = navigation.find('li').length;
                let $width = 100 / $total;
                const $wizard = navigation.closest('.wizard-card');

                const $display_width = $(document).width();

                if ($display_width < 600 && $total > 3) {
                    $width = 50;
                }

                navigation.find('li').css('width', $width + '%');
            },

            onTabClick: function (tab: any, navigation: any, index: any) {

                const $wizard = navigation.find('li');
                const $valid = $('.wizard-card form').valid();

                if (!$valid) {
                    return false;
                }
                else {
                    return true;
                }
            },

            onTabShow: function (tab: any, navigation: any, index: any) {
                const $total = navigation.find('li').length;
                let $current = index + 1;
                var $percent = ($current / $total) * 100;

                const $wizard = navigation.closest('.wizard-card');

                // If it's the last tab then hide the last button and show the finish instead
                if ($current >= $total) {
                    $($wizard).find('.btn-next').hide();
                    $($wizard).find('.btn-finish').show();
                } else {
                    $($wizard).find('.btn-next').show();
                    $($wizard).find('.btn-finish').hide();
                }

                $('.wizard-card .progress-bar').css({ width: $percent + '%' });
            }
        });

        firebase.auth().languageCode = 'en';

        this.windowRef = this.reg.windowRef;
        let self = this;
        this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            'size': 'normal',
            'callback': function (response) {
                self.recaptchaVerified = true;
                self.confPassEle.nativeElement.focus(); //Required as an extra click is necessary to get back to the form
            },
            'expired-callback': function () {
                self.recaptchaVerified = false;
                swal('Oops...', 'reCAPTCHA expired. Please verify again!', 'error');
            }
        });
        this.windowRef.recaptchaVerifier.render();
    }

    onSubmit(values: Object) {
        const $valid = $('.wizard-card form').valid();
        if ($valid) {

            values['phone'] = $('[name="phone"]').intlTelInput('getNumber');
            values['userType'] = 'general';
            this.currentUser = values['username'];
            //Save User
            this.reg.saveUser(values).subscribe((data) => {

                //Send SMS
                this.sendSMS(values['phone']);

                //Send Email
                this.sendEmail(values);

            }, (err) => {
                swal('Oops...', 'Error Saving User', 'error');
            });

        } else {
            swal('Error', 'Please check the Registration form for errors', 'error');
        }
    }

    sendEmail(values) {
        const email = values['email'];
        const username = values['username'];
        const password = values['password'];


        // Create user in the firebase
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(createUser => {
                if (createUser) {
                    //  Signin with user credentials
                    firebase.auth().signInWithEmailAndPassword(email, password)
                        .then(sign => {
                            if (sign) {
                                const name = values['firstname'] + ' ' + values['lastname'];
                                const user = firebase.auth().currentUser;
                                let actionCodeSettings = {
                                    url: environment.url + '/#/verify?uid=' + firebase.auth().currentUser.uid + '&username=' + username
                                };



                                user.updateProfile({
                                    displayName: name,
                                    photoURL: ''
                                })
                                    .then(() => {
                                        user.sendEmailVerification(actionCodeSettings)
                                            .then(result => {
                                                //   console.warn('succeed in Email Sent', user.emailVerified, result);
                                                this.registrationComplete = true;
                                            })
                                            .catch(err => swal(err.name, err.message, 'error'));
                                    })
                                    .catch(err => swal(err.name, err.message, 'error'));
                            }
                        })
                        .catch(err => swal(err.name, err.message, 'error'));
                }
            })
            .catch(err => {
                swal(err.name, err.message, 'error');
            });
    }


    sendSMS(phone) {
        const appVerifier = this.windowRef.recaptchaVerifier;
        firebase.auth().signInWithPhoneNumber(phone, appVerifier)
            .then((result) => {
                this.windowRef.confirmationResult = result;
                if (this.windowRef.confirmationResult) {
                    this.registrationComplete = true;
                }
            })
            .catch((error) => {
                swal(
                    'Oops...',
                    error.message,
                    'error'
                )
            });
    }

    verifyLoginCode(code) {
        let self = this;
        this.windowRef.confirmationResult.confirm(code)
            .then((result) => {
                swal({
                    type: 'success',
                    title: 'You have successfully registered with your phone number !'
                });
                self.phoneVerified = true;
                self.reg.phoneVerified(this.currentUser).subscribe(data => { });
            })
            .catch((error) => {
                swal({
                    type: 'error',
                    title: 'Could not register with the provided phone number !'
                });
            })
    }

    gotoLogin() {
        this.router.navigate(['/login']);
    }
}
