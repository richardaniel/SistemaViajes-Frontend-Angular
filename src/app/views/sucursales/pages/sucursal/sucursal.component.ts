import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SucursalService } from '../../services/sucursal.service';
import { MapaModalComponent } from "../../../../shared/components/mapa-modal/mapa-modal.component";
import { DxButtonModule } from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';

@Component({
  selector: 'app-sucursal',
  standalone: true,
  imports: [MapaModalComponent , DxButtonModule , ReactiveFormsModule , CommonModule],
  templateUrl: './sucursal.component.html',
  styleUrl: './sucursal.component.scss'
})
export class SucursalComponent {
  

    constructor(private readonly fb : FormBuilder ,
                private readonly sucursalService :SucursalService,
                private readonly sweetAlert :SweetAlertService
    ){
    }
  
    sucursalForm!: FormGroup;
    isMapPopupVisible = false;
    selectedLocation: { lat: number; lng: number; address: string; country: string; state: string; city: string } | null = null;
    
    ngOnInit(): void {
       
    
      this.sucursalForm = this.fb.group({
       
        nombre: ['', Validators.required],
        latitud: [0 ],
        longitud: [0,],
        direccion:['',Validators.maxLength(255)],
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
      if (this.sucursalForm.invalid) 
      {
        this.sweetAlert.advertencia("Campos Incompletos","Debe de ingresar todos los campos que son requeridos para continuar.")
        return;
      }
    
      if (this.selectedLocation) {
        this.sucursalForm.patchValue({
          latitud: this.selectedLocation.lat,
          longitud: this.selectedLocation.lng,
          direccion: this.selectedLocation.address,
          // paisId: this.getIdFromCountry(this.selectedLocation.country),
          // estadoId: this.getIdFromState(this.selectedLocation.state),
          // ciudadId: this.getIdFromCity(this.selectedLocation.city)
        });
      }
    
      this.sucursalService.addSucursal(this.sucursalForm.value)
      .subscribe(
        {
          next:(response)=>{
            console.log(response);
            this.sweetAlert.exito('Guardado', 'La sucursal ha sido registrada correctamente.');
            this.sucursalForm.reset(); 
            this.selectedLocation = null;
          },
          error:(err)=>{
            console.error(err);
            this.sweetAlert.error('Error', 'Hubo un problema al registrar la sucursal. Inténtelo nuevamente.');

          }
        }
      );
    }
}
