
import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appNoArrow]'
})
export class NoArrowDirective {

  constructor(private el: ElementRef) {
   // console.log('From No Arrow')
    setTimeout(() => {
      this.el.nativeElement.shadowRoot.querySelector('.select-icon-inner') && this.el.nativeElement.shadowRoot.querySelector('.select-icon-inner').setAttribute('style', 'display: none !important');
    }, 1000);

    }
}
