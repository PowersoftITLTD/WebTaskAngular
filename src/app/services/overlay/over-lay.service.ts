import { ComponentRef, Injectable, Injector, TemplateRef } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from 'ngx-toastr';
import { SidePanelComponent } from 'src/app/side-panel/side-panel-details/side-panel.component';
import { PortalInjector } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class OverLayService {

  private overlayRef: OverlayRef | null = null;

  constructor(private overlay: Overlay, private injector: Injector) { }

  openSidePanel() {
    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create({
        hasBackdrop: true,
        positionStrategy: this.overlay.position()
          .global()
          .right('0')
          .top('0')
      });
    }

    // Create a ComponentPortal with Injector
    const sidePanelPortal = new ComponentPortal(SidePanelComponent, this.injector);

    const componentRef = this.overlayRef.attach(sidePanelPortal);

    // Optionally, you can return componentRef or handle it for further interactions
  }

  closeSidePanel() {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef = null;
    }
  }
}