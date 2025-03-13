import { Component, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { ColorPickerService } from './color-picker/color-picker.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('colorPickerTemplate') colorPickerTemplate!: TemplateRef<any>;
  @ViewChild('colorPickerButton') colorPickerButton!: ElementRef;
  
  public headerBackground: string = '#ffffff';
  public headerBackgroundImage: string | null = null;
  
  constructor(private colorPickerService: ColorPickerService) {
    // Subscribe to color/image changes
    this.colorPickerService.color$.subscribe(color => {
      this.headerBackground = color;
      this.headerBackgroundImage = null;
    });
    
    this.colorPickerService.image$.subscribe(imageUrl => {
      this.headerBackgroundImage = `url(${imageUrl})`;
      this.headerBackground = 'transparent';
    });
  }
  
  public openColorPicker(): void {
    if (this.colorPickerButton && this.colorPickerTemplate) {
      this.colorPickerService.open(
        this.colorPickerButton.nativeElement,
        this.colorPickerTemplate
      );
    }
  }
  
  public onColorSelected(color: string): void {
    this.colorPickerService.updateColor(color);
  }
  
  public onImageSelected(imageUrl: string): void {
    this.colorPickerService.updateImage(imageUrl);
  }
  
  public closeColorPicker(): void {
    this.colorPickerService.close();
  }
}
