import { Directive, Input } from '@angular/core';

import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { ExcelExportService } from '../../../services/excel-export.service';

@Directive({
  selector: '[appExportSimpleExcel]',
  standalone: true
})
export class ExportSimpleExcelDirective {

  @Input() fileName: string = 'Nuevo';
  @Input() sheetName: string = 'Hoja1';

  constructor(private readonly excelExportService: ExcelExportService, private readonly dataGrid: DxDataGridComponent) {
    this.dataGrid.onExporting.subscribe((e) => this.onExporting(e));
  }

  onExporting(e: any) {
    this.excelExportService.exportingToExcel(e, this.fileName, this.sheetName);
  }
}