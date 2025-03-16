import { Component, OnInit } from '@angular/core';
import { ViajeService } from '../../services/viaje.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';
import { TransportistaViajesReporteDto } from '../../models/transportista-viajes-reporte.dto';
import { DxDataGridModule } from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reporte-transportista',
  standalone:true ,
  imports:[DxDataGridModule, CommonModule , FormsModule , ReactiveFormsModule],
  templateUrl: './listar-viaje.component.html',
  styleUrls: ['./listar-viaje.component.scss'],
})
export class ListarViajeComponent implements OnInit {
  reporte: TransportistaViajesReporteDto | null = null;
  fechaInicio: Date = new Date();
  fechaFin: Date = new Date();
  transportistaId: number = 0;

  constructor(
    private viajeService: ViajeService,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit(): void {
    
    this.fechaInicio = new Date();
    this.fechaFin = new Date();
    this.transportistaId = 1; 
  }

  obtenerReporte() {
    if (!this.transportistaId || !this.fechaInicio || !this.fechaFin) {
      this.sweetAlert.advertencia('Campos Incompletos', 'Debe completar todos los campos.');
      return;
    }
    const fechaInicioDate = new Date(this.fechaInicio);
    const fechaFinDate = new Date(this.fechaFin);
    
    this.viajeService
      .obtenerReporteTransportista(this.fechaInicio, this.fechaFin, this.transportistaId)
      .subscribe({
        next: (reporte) => {
          this.reporte = reporte;
          console.log('Reporte obtenido:', reporte);
        },
        error: (err) => {
          console.error('Error al obtener el reporte:', err);
          this.sweetAlert.error('Error', 'No se pudo obtener el reporte. Inténtelo nuevamente.');
        },
      });
  }
}