import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DxSelectBoxModule, DxTagBoxModule } from 'devextreme-angular';
import dxSelectBox, { ValueChangedEvent } from 'devextreme/ui/select_box';
import { Sucursal } from '../../../sucursales/models/Sucursal';
import { Colaborador } from '../../../colaboradores/models/Colaborador';
import { CommonModule } from '@angular/common';
import { ColaboradorService } from '../../../colaboradores/services/colaborador.service';
import { SucursalService } from '../../../sucursales/services/sucursal.service';
import { ViajeService } from '../../services/viaje.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';
import { viajeColaborador } from '../../models/viajeColaborador';
import { ColaboradorAsignadoDto } from '../../../colaboradores/models/ColaboradorAsignadoDto';
import { TransportistaService } from '../../../transportista/services/transportista.service';
import { Transportista } from '../../../transportista/models/Transportista';

@Component({
  selector: 'app-creacion-viaje',
  standalone: true,
  imports: [
    DxTagBoxModule,
    DxSelectBoxModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './creacion-viaje.component.html',
  styleUrl: './creacion-viaje.component.scss',
})
export class CreacionViajeComponent implements OnInit {
  viajeForm!: FormGroup;
  sucursales!: Sucursal[];
  colaboradoresAsignados: ColaboradorAsignadoDto[] = [];
  colaboradoresFiltrados: ColaboradorAsignadoDto[] = [];
  tarifaFija: number = 0;

  transportistas!: Transportista[];

  constructor(
    private readonly sucursalService: SucursalService,
    private readonly colaboradorService: ColaboradorService,
    private readonly transportistaService: TransportistaService,
    private readonly fb: FormBuilder,
    private readonly viajeService: ViajeService,
    private readonly sweetAlert: SweetAlertService
  ) {}

  ngOnInit(): void {
    this.viajeForm = this.fb.group({
      sucursal: ['', Validators.required],
      colaboradores: [[], Validators.required],
      transportista: ['', Validators.required],
      tarifa: [0, Validators.required], 
    });

   
    this.viajeForm.get('transportista')?.valueChanges.subscribe((transportistaId) => {
      const transportista = this.transportistas.find((t) => t.transportistaId === transportistaId);
      if (transportista) {
        this.tarifaFija = transportista.tarifa; 
        this.viajeForm.get('tarifa')?.setValue(transportista.tarifa); 
      }
    });

    this.loadSucursales();
    this.loadColaboradoresAsignados();
    this.loadTransportistas();
  }

  loadSucursales() {
    this.sucursalService.getSucursales().subscribe({
      next: (response) => {
        this.sucursales = response;
        console.log(this.sucursales);
      },
      error: (err) => {
        console.error(err);
        this.sweetAlert.error('Error', 'No se pudieron cargar las sucursales. Inténtelo nuevamente.');
      }
    });
  }

  loadColaboradoresAsignados() {
    this.colaboradorService.getColaboradoresAsignados().subscribe({
      next: (colaboradores) => {
        console.log(colaboradores);
        this.colaboradoresAsignados = colaboradores;
      },
      error: (err) => {
        console.error(err);
        this.sweetAlert.error('Error', 'No se pudieron cargar los colaboradores. Inténtelo nuevamente.');
      }
    });
  }

  cargarColaboradores(event: ValueChangedEvent): void {
    const sucursalId = event.value;
    if (sucursalId) {
      this.colaboradoresFiltrados = this.colaboradoresAsignados.filter(
        (colaborador) => colaborador.sucursal.sucursalId === sucursalId
      );
      if (this.colaboradoresFiltrados.length === 0) {
        this.sweetAlert.advertencia(
          'Sin Colaboradores',
          'No hay colaboradores asignados a esta sucursal.'
        );
      }
      this.viajeForm.get('colaboradores')?.setValue([]); 
    } else {
      this.colaboradoresFiltrados = [];
    }
  }

  loadTransportistas() {
    this.transportistaService.getTransportistas().subscribe({
      next: (transportistas) => {
        console.log(transportistas);
        this.transportistas = transportistas;
      },
      error: (err) => {
        console.error(err);
        this.sweetAlert.error('Error', 'No se pudieron cargar los transportistas. Inténtelo nuevamente.');
      }
    });
  }

  onSubmit(): void {
    if (this.viajeForm.invalid) {
      this.sweetAlert.advertencia(
        'Campos Incompletos',
        'Debe ingresar todos los campos que son requeridos para continuar.'
      );
      return;
    }

    const sucursalId = this.viajeForm.get('sucursal')?.value;
    const colaboradoresIds = this.viajeForm.get('colaboradores')?.value;
    const transportistaId = this.viajeForm.get('transportista')?.value;
    const tarifa = this.viajeForm.get('tarifa')?.value;
    const usuarioRegistroId = 1;

    const viajeData: viajeColaborador = {
      sucursalId: sucursalId,
      colaboradoresIds: colaboradoresIds,
      transportistaId: transportistaId,
      tarifa: tarifa,
      usuarioRegistroId: usuarioRegistroId,
    };
    console.log(viajeData);

    this.viajeService.addViajeColaborador(viajeData).subscribe({
      next: (response) => {
        console.log(response);
        this.sweetAlert.exito(
          'Guardado',
          response.message
        );
        this.viajeForm.reset({
          sucursal: '',
          colaboradores: [],
          transportista: '',
          tarifa: 0, 
        });
      },
      error: (err) => {
        console.error(err);
        this.sweetAlert.error(
          'Error',
          'Hubo un problema al guardar el viaje. Inténtelo nuevamente.'
        );
      },
    });
  }
}