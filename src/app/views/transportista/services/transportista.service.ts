import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { Transportista } from '../models/Transportista';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransportistaService {

   private endpoint = 'Transportista'; 
  
    constructor(private apiService: ApiService) {}
  
    getTransportistas(): Observable<Transportista[]> {
      return this.apiService.get(`${this.endpoint}/ObtenerTransportistas`);
    }
}
