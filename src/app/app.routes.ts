import { Routes } from '@angular/router';
import { FsAuthGuard, FsAuthRouting } from '@farsiman/idf-angular';
import { LayoutComponent } from './layout/layout/layout.component';

export const routes: Routes = [
  
  FsAuthRouting,

  {
    path: 'public/inicio', 
    loadComponent: () =>
      import('./views/auth/inicio/inicio.component').then((c) => c.InicioComponent),
  },


  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'public/inicio',
  },


  {
    path: 'home',
    component: LayoutComponent,
    canActivate: [FsAuthGuard], 
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        redirectTo: 'inicio', 
        pathMatch:'full'
      },
      {
        path: 'inicio',
        loadComponent: () =>
          import('./views/auth/inicio/inicio.component').then((c) => c.InicioComponent),
      },
      {
        path: 'registrarColaborador',
        loadComponent: () =>
          import('./views/colaboradores/pages/colaborador/colaborador.component')
            .then((c) => c.ColaboradorComponent),
      },
      {
        path: 'listarColaboradores',
        loadComponent: () =>
          import('./views/colaboradores/pages/listarcolaboradores/listarcolaboradores.component')
            .then((c) => c.ListarcolaboradoresComponent),
      },
      {
        path: 'asignarColaboradorSucursal',
        loadComponent: () =>
          import('./views/colaboradores/pages/asignar-colaborador-sucursal/asignar-colaborador-sucursal.component')
            .then((c) => c.AsignarColaboradorSucursalComponent),
      },
      {
        path: 'registrarSucursal',
        loadComponent: () =>
          import('./views/sucursales/pages/sucursal/sucursal.component')
            .then((c) => c.SucursalComponent),
      },
      {
        path: 'listarSucursales',
        loadComponent: () =>
          import('./views/sucursales/pages/listarsucursales/listarsucursales.component')
            .then((c) => c.ListarsucursalesComponent),
      },
      {
        path: 'crearViaje',
        loadComponent: () =>
          import('./views/viajes/pages/creacion-viaje/creacion-viaje.component')
            .then((c) => c.CreacionViajeComponent),
      },
      {
        path: 'reporteViajes',
        loadComponent: () =>
          import('./views/viajes/pages/listar-viaje/listar-viaje.component')
            .then((c) => c.ListarViajeComponent),
      }
    ],
  },

  {
    path: '**',
    redirectTo: 'public/inicio',
  },
];
