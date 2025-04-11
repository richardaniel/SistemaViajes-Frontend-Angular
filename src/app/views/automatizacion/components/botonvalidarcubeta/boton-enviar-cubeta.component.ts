import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';
import { HttpResponse } from '@angular/common/http';
/**
 * Estructura de producto para tu JSON de prueba:
 *   {
 *     itemcode: string;
 *     cantidad: number;
 *   }
 */
interface Producto {
  itemcode: string;
  cantidad: number;
}

@Component({
  standalone: true,
  selector: 'app-boton-enviar-cubeta',
  imports: [CommonModule],
  template: `
    <button
      (click)="enviarDatos()"
      class="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Enviar al flujo
    </button>
  `,
  styleUrls: []
})
export class BotonEnviarCubetaComponent {
    
    constructor(private http: HttpClient,private readonly sweetAlert: SweetAlertService) {}
  /**
   * Código de la cubeta (lo que luego tu flujo necesita como "cubetacode").
   */
  @Input() cubetaCode: string = '';

  /**
   * Arreglo de productos a enviar (lo que luego tu flujo necesita como "productos").
   */
  @Input() productos: Producto[] = [];

  /**
   * Método que se activa al hacer clic en el botón.
   * Aquí construimos el JSON final como lo requiere el flujo,
   * y podemos mostrarlo en consola o llamar a un servicio.
   */
//   enviarDatos(): void {
//     const body = {
//       cubetacode: this.cubetaCode,
//       productos: this.productos
//     };

//     // Aquí simplemente lo mostramos en consola. 
//     // En un escenario real, podrías inyectar un servicio y hacer:
//     // this.miServicio.llamarFlujo(body).subscribe(...);
//     console.log('JSON a enviar al flujo:', body);
//   }
enviarDatos(): void {
    const body = {
      cubetacode: this.cubetaCode,
      productos: this.productos
    };

    // URL de tu flujo
    const urlFlujo = 'https://prod-65.westus.logic.azure.com:443/workflows/6acc9fee3ce04fa185bb8e47bd4e2cb3/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=I0963PJGxMXCt6rioUsL2wB4qSzboP6Gxw0z-iYJJF8';

    console.log('JSON a enviar al flujo:', body);

    // Llamada POST al flujo con el objeto "body"
    // this.http.post(urlFlujo, body).subscribe({
    //   next: (respuesta) => {
    //     console.log('Respuesta OK:', respuesta);
    //     // Supongamos que tienes algo como:
    //     const respuestas = respuesta.body; // Ajusta dependiendo de dónde guardes tu JSON de respuesta

    //     // Obtener las listas de diferencias
    //     const difsItemCode = respuestas?.DiferenciasItemCode || [];
    //     const difsCantidad = respuestas?.DiferenciasCantidad || [];

    //     // Calcular la cantidad total de diferencias
    //     const totalDiferencias = difsItemCode.length + difsCantidad.length;

    //     // Si NO hay diferencias, mostrar que está validada correctamente
    //     if (totalDiferencias === 0) {
    //     this.sweetAlert.exito('¡Validación Exitosa!', 'La cubeta está validada correctamente.');
    //     } else {
    //     // Mostrar un SweetAlert por cada diferencia de ItemCode
    //     difsItemCode.forEach((dif: any) => {
    //         this.sweetAlert.error('Diferencia de ItemCode', dif.Mensaje);
    //     });

    //     // Mostrar un SweetAlert por cada diferencia de Cantidad
    //     difsCantidad.forEach((dif: any) => {
    //         this.sweetAlert.error('Diferencia de Cantidad', dif.Mensaje);
    //     });
    //     }

    //   },
    //   error: (error) => {
    //     console.error('Error al llamar al flujo:', error);
    //     // Maneja el error como necesites
    //   }
    // });

    this.http.post<any>(urlFlujo, body, { observe: 'response' })
  .subscribe({
    next: (resp: HttpResponse<any>) => {
      // Ahora `resp` es un objeto HttpResponse que contiene { body, headers, status, ... }
      console.log('Respuesta OK:', resp);

      // El cuerpo del JSON ahora está en `resp.body`
      const respuestas = resp.body;

      const difsItemCode = respuestas?.DiferenciasItemCode || [];
      const difsCantidad = respuestas?.DiferenciasCantidad || [];
      const totalDiferencias = difsItemCode.length + difsCantidad.length;

      if (totalDiferencias === 0) {
        this.sweetAlert.exito('¡Validación Exitosa!', 'La cubeta está validada correctamente.');
      } else {
        difsItemCode.forEach((dif: any) => {
          this.sweetAlert.error('Diferencia de ItemCode', dif.Mensaje);
        });
        difsCantidad.forEach((dif: any) => {
          this.sweetAlert.error('Diferencia de Cantidad', dif.Mensaje);
        });
      }
    },
    error: (error) => {
      console.error('Error al llamar al flujo:', error);
    }
  });
  }
}
