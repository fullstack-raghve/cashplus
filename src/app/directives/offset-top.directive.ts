import { Directive, ElementRef } from '@angular/core';

@Directive({ selector: '[appOffsetTop]'})
export class OffsetTopDirective {
  constructor(private _el: ElementRef) { }
  get offsetTop(): any { return this._el.nativeElement.offsetTop; }
}