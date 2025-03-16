import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { viajeColaborador } from '../models/viajeColaborador';
import { Observable } from 'rxjs';
import { TransportistaViajesReporteDto } from '../models/transportista-viajes-reporte.dto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {
  private apiUrl = `https://localhost:44390/api/Viaje`; 
  private endpoint = 'Viaje'; 
  
    constructor(private apiService: ApiService ,
      private http: HttpClient
    ) {}
  
    
    addViajeColaborador(data: viajeColaborador): Observable<any> {
      return this.apiService.post(`${this.endpoint}/CrearViajeColaboradores`, data);
    }



    obtenerReporteTransportista(fechaInicio: Date, fechaFin: Date, transportistaId: number): Observable<TransportistaViajesReporteDto> {
      const params = {
        FechaInicio: fechaInicio.toISOString().split('T')[0], 
        FechaFin: fechaFin.toISOString().split('T')[0], 
        TransportistaId: transportistaId.toString(),
      };
      return this.http.get<TransportistaViajesReporteDto>(`${this.apiUrl}/reporte-transportista`, { params });
    }
}
