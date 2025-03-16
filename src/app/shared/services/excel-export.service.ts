import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver'
import { exportDataGrid } from 'devextreme/excel_exporter';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  exportingToExcel(e: DxDataGridTypes.ExportingEvent, nombreArchivo: string, nombreHoja:string) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(nombreHoja);

    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
      customizeCell:function(options){
        options.excelCell.font={name:'Arial', size:12};
        options.excelCell.alignment ={horizontal:'left'}
      }
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `${nombreArchivo}.xlsx`);
      });
    });
  }
}
