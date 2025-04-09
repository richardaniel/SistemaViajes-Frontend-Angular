import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NombreProductoCoincidencia } from '../models/NombreProductoCoincidencia';
import { ProductoBaseDeDatos } from '../models/ProductoBD';
import { ProductoInsert } from '../models/ProductoInsert';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly url = 'https://prod-33.westus.logic.azure.com:443/workflows/26c652234f474c50803cf7b57824b338/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Tb_i01-iRCqwiZmDLdyWg70agl3T2CvfDp656tyQ6P4';
  private readonly urlPoductoDB = 'https://prod-11.westus.logic.azure.com:443/workflows/61433dfc74cc41cbbbfef51217e0b0e1/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=zblGKp9UVl_bmCKfE3p8v0dkYyufs9GkeiyP3RUEkik';
  private readonly urlProductoInsert = 'https://prod-66.westus.logic.azure.com:443/workflows/ee997a512ef249f2a549f42ecdfa08b1/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=gHiwitlzLIJrtL3tIJaOFo-dV_59lU12rU9XRRFMD1o' ;
  
  constructor(private http: HttpClient) {}

  detectarProducto(imagen: File): Observable<NombreProductoCoincidencia[]> {
    const formData = new FormData();
    formData.append('file', imagen); 

    return this.http.post<NombreProductoCoincidencia[]>(this.url, formData);
  }

  cargarProductosDB(){
    return this.http.get<ProductoBaseDeDatos[]>(this.urlPoductoDB);
  }


  insertarProducto(data:ProductoInsert[]):Observable<ProductoInsert[]>{
    return this.http.post<ProductoInsert[]>(this.urlProductoInsert,data);
  }
}
