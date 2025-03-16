export interface TransportistaViajesReporteDto {
    transportistaId: number;
    nombreTransportista: string;
    viajes: ViajeDetalleDto[];
    totalAPagar: number;
  }
  
  export interface ViajeDetalleDto {
    viajeId: number;
    fechaViaje: Date;
    sucursalId: number;
    distanciaTotalKm: number;
    costoTotal: number;
    monedaId: number;
  }