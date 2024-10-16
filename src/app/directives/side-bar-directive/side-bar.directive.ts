import { Directive, ElementRef, HostBinding, HostListener, Renderer2 } from '@angular/core';
import { SideBarService } from 'src/app/services/side-panel/side-bar.service';

@Directive({
  selector: '[appSideBar]'
})
export class SideBarDirective {
  isToggled: boolean = false;



  constructor(private el: ElementRef, private renderer: Renderer2, private sidebarService: SideBarService) {
    this.sidebarService.sidebarWidth$.subscribe(width => {
      this.renderer.setStyle(this.el.nativeElement, 'width', width);
    });
  }  

  @HostListener('mouseenter')
  onMouseEnter() {
    this.renderer.setStyle(this.el.nativeElement, 'width', '100%');
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    // Set width to the value from the service
    this.sidebarService.sidebarWidth$.subscribe(width => {
      this.renderer.setStyle(this.el.nativeElement, 'width', width);
    });
  }

  

 

}
