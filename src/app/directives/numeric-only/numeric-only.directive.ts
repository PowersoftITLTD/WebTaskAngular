import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumericOnly]'
})
export class NumericOnlyDirective {

  constructor() { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {

    // console.log('Event check: ',event)
    if (!event.key.match(/[\d\b\ArrowLeft\ArrowRight\Backspace]/)) {
      event.preventDefault();
    }
  }

}
