import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective {

  constructor(private el: ElementRef) {
  }
 
  ngAfterViewInit() {
      setTimeout(()=>{ 
        this.el.nativeElement.focus();
    },0);

  }

}
