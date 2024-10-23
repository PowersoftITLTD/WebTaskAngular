import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumericOnly]'
})
export class NumericOnlyDirective {

  constructor() { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const validKeys = /[1-9\b]|ArrowLeft|ArrowRight|Backspace/;


    // console.log('Event check: ',event)
    if (!event.key.match(validKeys)) {
      event.preventDefault();
    }
  }

}
