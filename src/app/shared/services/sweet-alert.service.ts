import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() { }

  // Alerta de Confirmación Genérica
  confirmacion(
    titulo: string,
    texto: string,
    confirmButtonText: string = 'Sí, continuar',
    cancelButtonText: string = 'No, cancelar'
  ): Promise<boolean> {
    return Swal.fire({
      title: titulo,
      text: texto,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText
    }).then((result) => result.isConfirmed);
  }


  exito(titulo: string, texto: string) {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
  }

  error(titulo: string, texto: string) {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
  }


  informacion(titulo: string, texto: string) {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: 'info',
      confirmButtonText: 'Aceptar'
    });
  }


  advertencia(titulo: string, texto: string) {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: 'warning',
      confirmButtonText: 'Aceptar'
    });
  }
}
