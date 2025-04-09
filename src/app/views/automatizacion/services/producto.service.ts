import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NombreProductoCoincidencia } from '../models/NombreProductoCoincidencia';
import { ProductoBaseDeDatos } from '../models/ProductoBD';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly url = 'https://prod-145.westus.logic.azure.com:443/workflows/d58d7837f70448dc8ce8344a7168f711/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=vktNvjYexF8AGIAXSdeAE6r0oQWJRuEIqivQVyzW4J8';
  private readonly urlPoductoDB = 'https://prod-11.westus.logic.azure.com:443/workflows/61433dfc74cc41cbbbfef51217e0b0e1/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=zblGKp9UVl_bmCKfE3p8v0dkYyufs9GkeiyP3RUEkik'
  constructor(private http: HttpClient) {}

  detectarProducto(imagen: File): Observable<NombreProductoCoincidencia[]> {
    const formData = new FormData();
    formData.append('file', imagen); 

    return this.http.post<NombreProductoCoincidencia[]>(this.url, formData);
  }

  cargarProductosDB(){
    return this.http.get<ProductoBaseDeDatos[]>(this.urlPoductoDB);
  }
}
