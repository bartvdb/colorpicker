import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColorPickerComponent } from './color-picker.component';

// Kendo UI imports
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { TabStripModule } from '@progress/kendo-angular-layout';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { PopupModule } from '@progress/kendo-angular-popup';
import { InputsModule } from '@progress/kendo-angular-inputs';

@NgModule({
  declarations: [
    ColorPickerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonsModule,
    TabStripModule,
    DropDownsModule,
    PopupModule,
    InputsModule
  ],
  exports: [
    ColorPickerComponent
  ]
})
export class ColorPickerModule { }
