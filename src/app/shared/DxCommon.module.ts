import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevExtremeModule, DxButtonModule, DxTextBoxModule } from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    DevExtremeModule
  ],
  exports: [
    DevExtremeModule,
    DxTextBoxModule,
    DxButtonModule
  ]
})
export class DxCommonModule { }
