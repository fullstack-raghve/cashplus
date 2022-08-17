import { Directive, ElementRef } from '@angular/core';

@Directive({selector: '[appScrollable]'})
export class ScrollableDirective {
  constructor(private _el: ElementRef) {}
  set scrollTop(value: any) { this._el.nativeElement.scrollTop = value; }
}