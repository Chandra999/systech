import { FormControl, FormGroup } from "@angular/forms";



export function usernameLengthValidator(control: FormControl): { [key: string]: any } {
  var uname: string = control.value;
  if (!(uname.length < 255)) {
    return { maxLen: true };
  }
}

export function emailValidator(control: FormControl): { [key: string]: any } {
  var emailRegexp = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
  if (control.value && !emailRegexp.test(control.value)) {
    return { invalidEmail: true };
  }
}

export function matchingPasswords(passwordKey: string, verifyPasswordKey: string) {
  return (group: FormGroup): { [key: string]: any } => {
    let password = group.controls[passwordKey];
    let verifyPassword = group.controls[verifyPasswordKey];
    if (password.value !== verifyPassword.value) {
      return {
        mismatchedPasswords: true
      };
    }
  }
}


export function passwordValidator(control: FormControl): { [key: string]: any } {
  var pass: string = control.value;
  if (!pass.match(/[0-9]/)) {
    return { minNumber: true };
  }
}

export function passwordLengthValidator(control: FormControl): { [key: string]: any } {
  var pass: string = control.value;
  if (!(pass.length >= 6)) {
    return { minLen: true };
  }
}

export function passwordSpecialValidator(control: FormControl): { [key: string]: any } {
  var pass: string = control.value;
  if (!pass.match(/[!,%,&,@,#,$,^,*,?,_,~]/)) {
    return { specialChar: true };
  }
}

export function passwordCharCValidator(control: FormControl): { [key: string]: any } {
  var pass: string = control.value;
  if (!pass.match(/[A-Z]/)) {
    return { minCapChar: true };
  }
}

export function passwordCharSValidator(control: FormControl): { [key: string]: any } {
  var pass: string = control.value;
  if (!pass.match(/[a-z]/)) {
    return { minSmallChar: true };
  }
}

export function passwordSpaceValidator(control: FormControl): { [key: string]: any } {
  var pass: string = control.value;
  if (!pass.match(/^\S*$/)) {
    return { noSpace: true };
  }
}