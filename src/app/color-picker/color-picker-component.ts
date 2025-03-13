import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { ColorPickerService } from './color-picker.service';

interface RgbValues {
  r: number;
  g: number;
  b: number;
  [key: string]: number;
}

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {
  @Output() colorSelected = new EventEmitter<string>();
  @Output() imageSelected = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();
  
  @ViewChild('colorGradient') colorGradientEl!: ElementRef;
  
  public tabSelected = 'custom';
  public currentColor = '#ff0000';
  public alpha = 1.0;
  public rgbValues: RgbValues = { r: 255, g: 0, b: 0 };
  public presetColors = [
    ['#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff'],
    ['#294f7b', '#3174af', '#5095d5', '#9bc1e5', '#c7ddee', '#e3eff8'],
    ['#864200', '#d36100', '#ff9444', '#ffd068', '#ffe8b4', '#fff5e1'],
    ['#7a4a1d', '#cb6c24', '#f59331', '#face58', '#f4e7ae', '#fcf5e1'],
    ['#385723', '#548235', '#70ad47', '#a8d08d', '#c5e0b3', '#e1efd6'],
    ['#15457a', '#2472b8', '#3d98dd', '#a5c8e8', '#dde8f7', '#f0f5fb']
  ];
  public months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  public selectedMonth = 'April';
  public presetImages = {
    'April': [
      'assets/images/april/easter-eggs.jpg',
      'assets/images/april/cherry-blossom.jpg',
      'assets/images/april/spring-flowers.jpg',
      'assets/images/april/spring-park.jpg'
    ]
  };
  
  constructor(private colorPickerService: ColorPickerService) {
    // Make the service accessible for the close method
    (window as any)['colorPickerServiceInstance'] = this.colorPickerService;
  }

  ngOnInit(): void {
  }

  public selectTab(tab: string): void {
    this.tabSelected = tab;
  }

  public updateColorFromGradient(event: MouseEvent): void {
    if (!this.colorGradientEl) return;
    
    const gradientEl = this.colorGradientEl.nativeElement;
    const rect = gradientEl.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    
    // Convert position to HSV and then to RGB
    const h = 0; // We're using a red gradient
    const s = x;
    const v = 1 - y;
    
    this.updateColorFromHSV(h, s, v);
  }

  public updateAlpha(value: number): void {
    this.alpha = value;
    this.emitColor();
  }

  public selectPresetColor(color: string): void {
    this.currentColor = color;
    // Update RGB values
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    if (result) {
      this.rgbValues = {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      };
    }
    this.emitColor();
  }

  public selectImage(imagePath: string): void {
    this.imageSelected.emit(imagePath);
    this.closeColorPicker();
  }

  public updateRGB(channel: string, value: number): void {
    this.rgbValues[channel] = value;
    this.currentColor = this.rgbToHex(this.rgbValues.r, this.rgbValues.g, this.rgbValues.b);
    this.emitColor();
  }

  private updateColorFromHSV(h: number, s: number, v: number): void {
    // Convert HSV to RGB
    let r: number, g: number, b: number;
    
    if (s === 0) {
      r = g = b = v;
    } else {
      const i = Math.floor(h * 6);
      const f = h * 6 - i;
      const p = v * (1 - s);
      const q = v * (1 - f * s);
      const t = v * (1 - (1 - f) * s);
      
      switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
        default: r = v; g = t; b = p;
      }
    }
    
    // Convert from 0-1 to 0-255
    this.rgbValues = {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
    
    this.currentColor = this.rgbToHex(this.rgbValues.r, this.rgbValues.g, this.rgbValues.b);
    this.emitColor();
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  private emitColor(): void {
    const rgba = `rgba(${this.rgbValues.r}, ${this.rgbValues.g}, ${this.rgbValues.b}, ${this.alpha})`;
    this.colorSelected.emit(rgba);
  }

  public handleFileInput(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageSelected.emit(e.target.result);
        this.closeColorPicker();
      };
      reader.readAsDataURL(file);
    }
  }

  public selectMonth(month: string): void {
    this.selectedMonth = month;
  }
  
  public onClose(): void {
    this.close.emit();
    this.colorPickerService.close();
  }
  
  public applyColor(): void {
    this.emitColor();
    this.closeColorPicker();
  }
  
  private closeColorPicker(): void {
    this.colorPickerService.close();
  }
}
