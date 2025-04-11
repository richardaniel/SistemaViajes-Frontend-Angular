import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { codigoCubeta } from '../models/CodigoCubeta';
import { ProductoCoincidencia } from '../models/ProductoCoincidencia';

@Injectable({
  providedIn: 'root'
})
export class LecturaCubetaService {

  //Flujo Madian
  private readonly url = 'https://prod-74.westus.logic.azure.com:443/workflows/da9cfbc08f2f40a1b57aea638c48830f/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=-wEauX-W3OWKQAzVNtTpJiK-9Dn3ySIEopwAU4cGKBQ';

  //Flujo Sua
  //private readonly urlRecognizeMatchedProducts = 'https://prod-07.westus.logic.azure.com:443/workflows/bbdfd3bf482141f48a106942e4520bcd/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=FRTK28nPzDgcSV4frNSuKNQ6RrzqlnhgPhblKqhn8w0';
    
  //Flujo David
  private readonly urlRecognizeMatchedProducts='https://prod-138.westus.logic.azure.com:443/workflows/0cff1c4d9a954589bb160ec6aacaa592/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=fvs7R9yj0FDaBPHFs2w9GqJZVkKydKdh4OeiiyJXf50';
    constructor(private http: HttpClient) {}
  
    detectarCodigoBarras(imagen: File): Observable<codigoCubeta[]> {
      const formData = new FormData();
      formData.append('file', imagen); 
  
      return this.http.post<codigoCubeta[]>(this.url, formData);
    }


    subirImagenesProductosCubeta(formData: FormData): Observable<ProductoCoincidencia[]> {
      return this.http.post<ProductoCoincidencia[]>(this.urlRecognizeMatchedProducts, formData);
    }

    
}
