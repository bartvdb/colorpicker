import { Injectable, TemplateRef } from '@angular/core';
import { PopupService, PopupRef } from '@progress/kendo-angular-popup';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColorPickerService {
  private colorPickerRef: PopupRef | null = null;
  private colorSubject = new Subject<string>();
  private imageSubject = new Subject<string>();
  
  color$ = this.colorSubject.asObservable();
  image$ = this.imageSubject.asObservable();

  constructor(private popupService: PopupService) { }

  public open(anchor: HTMLElement, template: TemplateRef<any>): void {
    // Close any existing popups
    this.close();
    
    // Open a new popup
    this.colorPickerRef = this.popupService.open({
      anchor: anchor,
      content: template,
      popupClass: 'color-picker-popup',
      animate: true,
      collision: {
        horizontal: 'fit',
        vertical: 'flip'
      }
    });
  }

  public close(): void {
    if (this.colorPickerRef) {
      this.colorPickerRef.close();
      this.colorPickerRef = null;
    }
  }

  public updateColor(color: string): void {
    this.colorSubject.next(color);
  }

  public updateImage(imageUrl: string): void {
    this.imageSubject.next(imageUrl);
  }
}
