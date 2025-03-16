import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DxButtonModule, DxSelectBoxModule } from 'devextreme-angular';
import { ColaboradorService } from '../../services/colaborador.service';
import { SucursalService } from '../../../sucursales/services/sucursal.service';
import { Sucursal } from '../../../sucursales/models/Sucursal';
import { Colaborador } from '../../models/Colaborador';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';
import { AsignarColaborador } from '../../models/AsignarColaborador';

@Component({
  selector: 'app-asignar-colaborador-sucursal',
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule , DxSelectBoxModule , DxButtonModule],
  templateUrl: './asignar-colaborador-sucursal.component.html',
  styleUrl: './asignar-colaborador-sucursal.component.scss'
})

export class AsignarColaboradorSucursalComponent  implements OnInit {

  colaboradorAsignForm!: FormGroup;
  sucursales: Sucursal[] = [];
  colaboradores: Colaborador[] = [];
  colaboradorSeleccionado: any = null;
  sucursalSeleccionada :any = null ;

  constructor(
    private fb: FormBuilder,
    private colaboradorService: ColaboradorService,
    private sucursalService: SucursalService ,
    private sweetAlert :SweetAlertService
  ) {}

  ngOnInit(): void {

    this.colaboradorAsignForm = this.fb.group({
      colaborador: ['', Validators.required], 
      sucursal: ['', Validators.required], 
    });


    this.cargarSucursales();
    this.cargarColaboradores();
  }

  showDetailsColaborador(event :any){
      const colaboradorId = event.value;
      this.colaboradorAsignForm.patchValue({colaborador:colaboradorId})

      this.colaboradorSeleccionado = this.colaboradores.find(c => c.colaboradorId === colaboradorId);
      console.log('Colaborador seleccionado:', this.colaboradorSeleccionado);
  }

  showDetailsSucursal(event :any){
    const sucursalId = event.value;
    this.colaboradorAsignForm.patchValue({sucursal:sucursalId})

    this.sucursalSeleccionada = this.sucursales.find(c => c.sucursalId === sucursalId);
    console.log('Sucursal seleccionada:', this.colaboradorSeleccionado);
}
  
  cargarSucursales() {
    this.sucursalService.getSucursales().subscribe((data) => {
      this.sucursales = data;
    });
  }

  cargarColaboradores() {
    this.colaboradorService.getColaboradores().subscribe((data) => {
      this.colaboradores = data;
    });
  }
  onSubmit() {
    if (this.colaboradorAsignForm.invalid) {
      this.sweetAlert.advertencia(
        'Campos Incompletos',
        'Debe completar todos los campos requeridos.'
      );
      return;
    }

    const colaboradorId = this.colaboradorAsignForm.get('colaborador')?.value;
    const sucursalId = this.colaboradorAsignForm.get('sucursal')?.value;

    let colaboradorAsignar : AsignarColaborador = {
      colaboradorId :colaboradorId ,
      sucursalId : sucursalId
    }

    this.colaboradorService.addColaboradorSucursal(colaboradorAsignar).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);
        this.sweetAlert.exito(
          'Éxito',
          'El colaborador ha sido asignado a la sucursal correctamente.'
        );
        this.colaboradorAsignForm.reset(); 
      },
      error: (err) => {
        console.error('Error al asignar colaborador:', err);
        this.sweetAlert.error(
          'Error',
          'Hubo un problema al asignar el colaborador a la sucursal. Inténtelo nuevamente.'
        );
      },
    });
  }
}