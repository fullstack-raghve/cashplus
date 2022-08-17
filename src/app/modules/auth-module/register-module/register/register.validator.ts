
import { FormGroup } from '@angular/forms';
 
// export class RegistrationValidator {
//     static validate(registrationFormGroup: FormGroup) {
//         let password = registrationFormGroup.controls.password.value;
//         let repeatPassword = registrationFormGroup.controls.repeatPassword.value;
 
//         if (repeatPassword.length <= 0) {
//             return null;
//         }
 
//         if (repeatPassword !== password) {
//             return {
//                 doesMatchPassword: true
//             };
//         }
 
//         return null;
 
//     }
// }

// added on 22-10
export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}

// end