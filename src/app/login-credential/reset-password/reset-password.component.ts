import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CredentialService } from 'src/app/services/credential/credential.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  changePasswordForm: FormGroup | any;

  @Input() loggedInUser: any;
  @Input() passwordKey: string | any;
  @Output() close = new EventEmitter<void>();

  hideCurrent = true;
  hideNew = true;
  hideConfirm = true;

  hide: boolean = true;
  passwordsMatching: boolean = false;
  isConfirmPasswordDirty: boolean = false;
  confirmPasswordClass = 'form-control';

  passwordNotMatch: boolean = true;
  password: string | null = null;

  source:any;

  passwordNotMatch_message: string | any;
  invalid_passwordNotMatch_message: string | any;
  passwordNotSequence_message: string | any;

  error_messages: any = {

    'currentPassword': [
      { type: 'required', message: 'Current is required.' },

    ],

    'newPassword': [
      { type: 'required', message: 'New password is required.' },
      { type: 'minlength', message: '* Password must be at least 8 characters long.' },
      { type: 'pattern', message: '* Password must contain uppercase, lowercase, number, and special character.' },
      { type_new: 'sequential', message: 'Sequential Character Not Allowed In Password.' },
      { type_new: 'inValid_passwordMatch', message: 'Old password and new password should not be same.' }
    ],

    'confirmPassword': [
      { type: 'required', message: 'Confirm password is required.' },
      { type: 'checkMatch', message: 'Confirm password Not Matching.', message_1: 'Please enter new password first.' },
    ],

  }

  constructor(
    private formBuilder: FormBuilder,
    private dataService: CredentialService,
    private activatedRoute: ActivatedRoute,
    private tostar: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.dataService.getUser();
    this.changePassword();


 
    this.dataService.getPassword().subscribe((pwd: any) => {
      console.log('Password Data', pwd);
      this.password = pwd; 
    });

    this.source = this.activatedRoute.queryParams.subscribe(params => {
      const source = params['source'];
      if(source){
        this.password
      }
    });

  }



  changePassword() {

    this.changePasswordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: [
        '',
        [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'), this.sequentialCharacterValidator.bind(this)]
      ],
      confirmPassword: ['', [Validators.required]]
    }, {

      validators: this.combinedPasswordValidator.bind(this)

    });

  }

  combinedPasswordValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    const oldPassword = formGroup.get('currentPassword')?.value;

    let isValid = true;
    this.passwordNotMatch_message = '';
    this.invalid_passwordNotMatch_message = '';

    if (!newPassword && confirmPassword) {
      this.passwordNotMatch_message = this.error_messages.confirmPassword[1].message_1;
      isValid = false;
    } else if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      this.passwordNotMatch_message = this.error_messages.confirmPassword[1].message;
      isValid = false;
    } else if (oldPassword === newPassword && oldPassword.length > 0) {
      this.invalid_passwordNotMatch_message = this.error_messages.newPassword[4].message;
      isValid = false;
    }

    return isValid ? null : {
      valid_passwordNotMatch: !newPassword || newPassword !== confirmPassword,
      invalid_passwordNotMatch: oldPassword === newPassword
    };
  }


  sequentialCharacterValidator(control: any) {
    const password = control.value;
    const lowerCasePassword = password?.toLowerCase();
    const sequentialPatterns = /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|123|234|345|456|567|678|789|012)/;

    if (sequentialPatterns.test(lowerCasePassword)) {
      return { sequential: true };
    }
    return null;
  }


  closeDialog() {
    this.close.emit();
  }


  resetNewPassword() {
    const passwordData = this.changePasswordForm.value;

    const curr_password = passwordData.currentPassword
    const new_password = passwordData.newPassword;
    const conf_password = passwordData.confirmPassword;

    const data = {
      LOGIN_NAME: this.loggedInUser[0]?.EMAIL_ID_OFFICIAL,
      CURRENT_PASSWORD: curr_password,
      NEW_PASSWORD: new_password,
      CONFIRM_PASSWORD: conf_password
    }

    console.log('Reset Password mandatory password', data)
  }


  togglePasswordVisibility(event: Event) {
    event.preventDefault();
    this.hide = !this.hide;
  }


  toggleVisibility(field: string) {
    switch (field) {
      case 'current':
        this.hideCurrent = !this.hideCurrent;
        break;
      case 'new':
        this.hideNew = !this.hideNew;
        break;
      case 'confirm':
        this.hideConfirm = !this.hideConfirm;
        break;
    }
  }


  changePasswordFormData() {

    // this.dataService.

    const passwordData = this.changePasswordForm.value;

    const user_curr_password = passwordData.currentPassword;
    const user_new_password = passwordData.newPassword;


    console.log('Get password', this.password)

    const current_password = this.password

    if (current_password !== user_curr_password) {
      this.tostar.error('Please put valid current password');
      return;
    }


    if (user_new_password === user_curr_password) {
      this.tostar.warning('Password should not be same as old password', 'Alert');
      return
    }

    this.resetNewPassword();
    this.dataService.logout();
    this.router.navigate(['/login/login-page']);
    this.tostar.success('Password reset successfully', 'Success');

  }

  backToPreviousWindow() {
    return history.back()
  }

}

