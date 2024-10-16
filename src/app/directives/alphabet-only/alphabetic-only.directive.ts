import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appAlphabeticOnly]'
})
export class AlphabeticOnlyDirective {

  constructor() { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key.match(/[^\sa-zA-Z]/)) {
      event.preventDefault();
    }
  }

}
