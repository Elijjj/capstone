import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCapitalizeFirst]'
})
export class CapitalizeFirstDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const inputValue = this.el.nativeElement.value;
    if (inputValue && inputValue.length > 0) {
      // Capitalize only the first letter of the entire string
      this.el.nativeElement.value = inputValue.charAt(0).toUpperCase() + inputValue.slice(1).toLowerCase();
    }
  }
}
