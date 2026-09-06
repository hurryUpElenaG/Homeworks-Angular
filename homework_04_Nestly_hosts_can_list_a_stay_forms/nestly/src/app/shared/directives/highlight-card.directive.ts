import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlightCard]',
  standalone: true,
})
export class HighlightCardDirective {
  @HostBinding('class.card-highlighted')
  isHighlighted = false;

  @HostListener('mouseenter')
  onMouseEnter() {
    this.isHighlighted = true;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.isHighlighted = false;
  }
}