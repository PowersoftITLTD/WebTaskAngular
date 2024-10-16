import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appYearFormat]'
})
export class YearFormatDirective {

  private readonly maxYearLength = 4;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event.target'])
  onInput(target: HTMLInputElement): void {
    let value = target.value;

    // console.log('Value', value)
    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return;
    }

    const year = date.getFullYear().toString();
    // console.log('Year from directive', year)

    if (year.length > this.maxYearLength) {
      
      // Correct the year and update the input value
      const truncatedYear = year.slice(0, this.maxYearLength);

      console.log('truncatedYear', truncatedYear)
      date.setFullYear(Number(truncatedYear));

      // Format date to 'yyyy-MM-dd'
      const formattedDate = this.formatDate(date);
      this.renderer.setProperty(target, 'value', formattedDate);
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    return `${year}`;
  }
}
