import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { Observable } from 'rxjs';
import { Colaborador } from '../models/Colaborador';
import { ColaboradorAsignadoDto } from '../models/ColaboradorAsignadoDto';
import { AsignarColaborador } from '../models/AsignarColaborador';

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {
  private endpoint = 'Colaborador'; 

  constructor(private apiService: ApiService) {}

  getColaboradores(): Observable<Colaborador[]> {
    return this.apiService.get(`${this.endpoint}/ObtenerColaboradores`);
  }

  getColaboradorById(id: number): Observable<Colaborador> {
    return this.apiService.getById(this.endpoint, id);
  }

  getColaboradoresAsignados(): Observable<ColaboradorAsignadoDto[]> {
    return this.apiService.get(`ColaboradorSucursal/ObtenerColaboradoresAsignados`);
  }

  // addColaborador(data: Colaborador): Observable<any> {
  //   return this.apiService.post(`${this.endpoint}/crearColaborador`, data);
  // }

  addColaborador(formData: FormData): Observable<any> {
    return this.apiService.post(`${this.endpoint}/CrearColaborador`, formData); 
  }

  addColaboradorSucursal(data :AsignarColaborador):Observable<any>{
    return this.apiService.post(`ColaboradorSucursal/AsignarColaboradorASucursal`, data);
  }

  updateColaborador(id: number, data: any): Observable<any> {
    return this.apiService.put(this.endpoint, id, data);
  }

  deleteColaborador(id: number): Observable<any> {
    return this.apiService.delete(this.endpoint, id);
  }
}
