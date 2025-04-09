import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DxMenuModule } from 'devextreme-angular';
import { ItemClickEvent } from 'devextreme/ui/menu';
import { DxCommonModule } from '../../shared/DxCommon.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [DxMenuModule,RouterLink , DxCommonModule , CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
selectedItem: any;

menuItems = [
  { 
    label: 'Colaboradores', 
    link: '',
    icon:'accountbox',
    submenu: [
      { label: 'Lista de Colaboradores', link: '/home/listarColaboradores' },
      { label: 'Agregar Colaborador', link: '/home/registrarColaborador' },
      { label : 'Asignar Colaborador-Sucursal', link:'/home/asignarColaboradorSucursal'}
    ],
    isOpen: false
  },
  { 
    label: 'Sucursales', 
    link: '',
    icon:'home',
    submenu: [
      { label: 'Lista de Sucursales', link: '/home/listarSucursales' },
      { label: 'Agregar Sucursal', link: '/home/registrarSucursal' }
    ],
    isOpen: false
  },
  { label: 'Transportistas', link: '/home/transportistas',icon:'user', submenu: [
    { label: 'Crear Transportista', link: '' },

  ], isOpen: false },

  { 
    label: 'Viajes', 
    link: '/home/viajes',
    icon:'car',
    submenu: [
      { label: 'Lista de Viajes', link: '/home/reporteViajes' },
      { label: 'Crear Viaje', link: '/home/crearViaje' },
      { label: 'Aprobacion de Solicitud', link: '' },
      { label: 'Actualizar Viaje', link: '' },
      {}
    ],
    isOpen: false 
  },

  { label: 'Reportes', link: '/home/reportes', icon:'textdocument', submenu: [], isOpen: false },

  {
    label : 'Automatizacion' , link: '/home/automatizacion' , icon:'user',submenu:[] ,isOpen:false 
  }

];

showSubMenu(){

}

toggleSubmenu(item: any, state: boolean) {
  item.isOpen = state;
}

onMenuItemClick($event: ItemClickEvent) {

}

}
