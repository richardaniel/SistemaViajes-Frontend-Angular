import { Sucursal } from "../../sucursales/models/Sucursal";
import { ColaboradorDtoResponse } from "./ColaboradorDtoResponse";

export interface ColaboradorAsignadoDto {
    colaboradorId: number;
    distancia_vivienda: number;
    sucursal: Sucursal;
    colaborador: ColaboradorDtoResponse;
  }