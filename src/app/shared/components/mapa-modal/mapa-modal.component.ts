import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { DxButtonModule, DxPopupModule } from 'devextreme-angular';

@Component({
  selector: 'app-mapa-modal',
  standalone:true,
  imports:[DxPopupModule,GoogleMapsModule , DxButtonModule , CommonModule],
  templateUrl: './mapa-modal.component.html',
  styleUrls: ['./mapa-modal.component.scss']
})
export class MapaModalComponent {
  @Input() isVisible: boolean = false; 
  @Input() selectedLocation: { lat: number; lng: number } | null = null;
  @Output() closePopup = new EventEmitter<void>();
  @Output() locationSelected = new EventEmitter<{ 
    lat: number; 
    lng: number;
    address:string ;
    country:string;
    state:string ;
    city:string;  
  }>();

  center: google.maps.LatLngLiteral = { lat: 15.505461213579585, lng: -88.02495002746582 };  

  zoom = 12;
  selectedMarker!: google.maps.LatLngLiteral ;

  addressDetails = {
    address: '',
    country: '',
    state: '',
    city: ''
  };

  placeMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.selectedMarker = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      
      };

      this.getAddressFromCoordinates(this.selectedMarker.lat, this.selectedMarker.lng);
    }
  }

   /** Obtener dirección usando Google Geocoder */
   getAddressFromCoordinates(lat: number, lng: number) {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat, lng };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK' && results![0]) {
        this.addressDetails.address = results![0].formatted_address;

        // Extraer país, estado y ciudad
        const addressComponents = results![0].address_components;
        this.addressDetails.country = this.getAddressComponent(addressComponents, 'country');
        this.addressDetails.state = this.getAddressComponent(addressComponents, 'administrative_area_level_1');
        this.addressDetails.city = this.getAddressComponent(addressComponents, 'locality');
      }
    });
  }

  /** Función auxiliar para obtener un componente de la dirección */
  getAddressComponent(components: google.maps.GeocoderAddressComponent[], type: string): string {
    const component = components.find(comp => comp.types.includes(type));
    return component ? component.long_name : '';
  }
  confirmLocation() {
    if (this.selectedMarker) {
      this.locationSelected.emit({
        lat: this.selectedMarker.lat,
        lng: this.selectedMarker.lng,
        address: this.addressDetails.address,
        country: this.addressDetails.country,
        state: this.addressDetails.state,
        city: this.addressDetails.city
      });
      this.closePopup.emit();
    }
  }
}
