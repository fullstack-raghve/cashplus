import { Directive, Input, Optional, HostListener } from '@angular/core';
import { FormControlDirective, FormControlName, ValidatorFn, Validators, AbstractControl, ValidationErrors, FormControl, NgControl } from '@angular/forms';

@Directive({
  selector: '[trimdirective]',
})
export class TripFormFieldDirective {

  onlyOneSpaceAllowed = ['firstName','lastName', 'address', 'city', 'searchInput', 'street', 'state', 'visaTYpe', 'cardname', 'name','enterName','nearlandmark']
  constructor(private control: NgControl) {}

  @HostListener('input', ['$event']) onEvent($event) {

    if (this.onlyOneSpaceAllowed.includes(this.control.name)) {
      this.forFirstNameTrim();
    } else {
      this.forAllInputType();
    }

  }

  forFirstNameTrim() {
    const abstractControl = this.control.control;
    if (abstractControl.value.startsWith(' ')) {
      let value = abstractControl.value.replace(/ +/g, '')
      abstractControl.setValue(value);
    }
    if (abstractControl.value.endsWith(' ')) {
      let value = abstractControl.value.replace(/ +/g, ' ')
      abstractControl.setValue(value);
    }
  }

  forAllInputType() {
    const abstractControl = this.control.control;
    let value = abstractControl.value.replace(/ +/g, '')
    abstractControl.setValue(value);
  }

}
