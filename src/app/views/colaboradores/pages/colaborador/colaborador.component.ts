import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DevExtremeModule, DxTextBoxModule } from 'devextreme-angular';
import { MapaModalComponent } from "../../../../shared/components/mapa-modal/mapa-modal.component";
import { ColaboradorService } from '../../services/colaborador.service';

import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';



@Component({
  selector: 'app-colaborador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DxTextBoxModule, DevExtremeModule, MapaModalComponent],
  templateUrl: './colaborador.component.html',
  styleUrl: './colaborador.component.scss'
})
export class ColaboradorComponent implements OnInit{



  constructor(private readonly fb : FormBuilder ,
              private readonly colaboradorService :ColaboradorService,
              private readonly sweetAlert :SweetAlertService)
  {}

  colaboradorForm!: FormGroup;
  isMapPopupVisible = false;
  selectedLocation: { lat: number; lng: number; address: string; country: string; state: string; city: string } | null = null;
  imagenSeleccionada: File | null = null;
  imagenVistaPrevia: string | null = null;


  ngOnInit(): void {
     
  
    this.colaboradorForm = this.fb.group({
     
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.email ,Validators.required]],
      telefono: ['' , 
         [Validators.required ,
         Validators.pattern('^\\+504\\s\\d{4}-\\d{4}$')
       ]
     ],
      latitud: [0 ],
      longitud: [0],
      direccion:[''],
      paisId: [1],
      estadoId: [1],
      ciudadId: [1],
     
    });
  }
  openMapPopup() {
  
    this.isMapPopupVisible = true;
  }
  closeMapPopup() {
    this.isMapPopupVisible = false;
  }

  onLocationSelected(location: { lat: number; lng: number; address: string; country: string; state: string; city: string }) {
    this.selectedLocation = location;
    console.log('Ubicación seleccionada en Perfil:', this.selectedLocation);
  }

  // Método para manejar la selección de imagen
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;

      // Mostrar vista previa de la imagen
      const reader = new FileReader();
      reader.onload = (e) => (this.imagenVistaPrevia = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  getIdFromCountry(countryName: string): number {
    const countryList = [
      { id: 1, name: 'Honduras' },
      { id: 2, name: 'México' },
      { id: 3, name: 'Estados Unidos' }
    ];
    return countryList.find(c => c.name === countryName)?.id || 0;
  }
  
  getIdFromState(stateName: string): number {
    const stateList = [
      { id: 1, name: 'Francisco Morazán' },
      { id: 2, name: 'Cortés' }
    ];
    return stateList.find(s => s.name === stateName)?.id || 0;
  }
  
  getIdFromCity(cityName: string): number {
    const cityList = [
      { id: 1, name: 'Tegucigalpa' },
      { id: 2, name: 'San Pedro Sula' }
    ];
    return cityList.find(c => c.name === cityName)?.id || 0;
  }

  onSubmit() {
    if (this.colaboradorForm.invalid) {
      this.sweetAlert.advertencia("Campos Incompletos", "Debe de ingresar todos los campos requeridos para continuar.");
      return;
    }

    if (this.selectedLocation) {
      this.colaboradorForm.patchValue({
        latitud: this.selectedLocation.lat,
        longitud: this.selectedLocation.lng,
        direccion: this.selectedLocation.address
      });
    }

    const formData = new FormData();

    // Agregar los campos uno por uno en lugar de enviarlos como JSON
    formData.append('Nombre', this.colaboradorForm.value.nombre);
    formData.append('Apellido', this.colaboradorForm.value.apellido);
    formData.append('Email', this.colaboradorForm.value.email);
    formData.append('Telefono', this.colaboradorForm.value.telefono);
    formData.append('Latitud', this.colaboradorForm.value.latitud);
    formData.append('Longitud', this.colaboradorForm.value.longitud);
    formData.append('Direccion', this.colaboradorForm.value.direccion);
    formData.append('PaisId', this.colaboradorForm.value.paisId);
    formData.append('EstadoId', this.colaboradorForm.value.estadoId);
    formData.append('CiudadId', this.colaboradorForm.value.ciudadId);

    
    if (this.imagenSeleccionada) {
        formData.append('Imagen', this.imagenSeleccionada);
    }

    this.colaboradorService.addColaborador(formData)
    .subscribe({
      next: (response) => {
        console.log(response);
        this.sweetAlert.exito('Guardado', 'El colaborador ha sido registrado correctamente.');
        this.colaboradorForm.reset(); 
        this.selectedLocation = null;
        this.imagenVistaPrevia = null;
      },
      error: (err) => {
        console.error(err);
        this.sweetAlert.error('Error', 'Hubo un problema al guardar el colaborador. Inténtelo nuevamente.');
      }
    });
}

}



