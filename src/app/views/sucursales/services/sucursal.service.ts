import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { Sucursal } from '../models/Sucursal';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {

  constructor(private readonly apiService : ApiService) { }


  private endpoint = 'Sucursal'; 

    getSucursales(): Observable<Sucursal[]> {
      return this.apiService.get(`${this.endpoint}/ObtenerSucursales`);
    }
  
    getSucursalById(id: number): Observable<Sucursal> {
      return this.apiService.getById(this.endpoint, id);
    }
  
    addSucursal(data: Sucursal): Observable<any> {
      return this.apiService.post(`${this.endpoint}/RegistrarSucursal`, data);
    }
  
    updateSucursal(id: number, data: any): Observable<any> {
      return this.apiService.put(this.endpoint, id, data);
    }
  
    deleteSucursal(id: number): Observable<any> {
      return this.apiService.delete(this.endpoint, id);
    }
}
