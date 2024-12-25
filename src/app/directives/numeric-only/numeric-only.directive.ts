import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumericOnly]'
})
export class NumericOnlyDirective {

  constructor() { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const inputField = event.target as HTMLInputElement;
    const currentValue = inputField?.value || '';

    // Regular expression to allow only numbers and specific keys
    const validKeys = /^[1-9]$/; // For 1-9
    const allowsZeroAfterNonZero = /^[1-9][0-9]*$/; // Non-zero followed by any digits, including zeroes

    // Allow backspace, arrow keys, and numbers 1-9 at any time
    if (
      event.key === 'Backspace' || 
      event.key === 'ArrowLeft' || 
      event.key === 'ArrowRight' || 
      validKeys.test(event.key) ||
      (event.key === '0' && allowsZeroAfterNonZero.test(currentValue))
    ) {
      return; // Allow the event if conditions are met
    } 

    // Prevent the event for invalid inputs (0 at the start, etc.)
    event.preventDefault();
  }
}
