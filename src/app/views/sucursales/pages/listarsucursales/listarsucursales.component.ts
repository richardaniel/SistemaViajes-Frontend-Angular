import { Component, OnInit } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular';
import { Sucursal } from '../../models/Sucursal';
import { SucursalService } from '../../services/sucursal.service';

@Component({
  selector: 'app-listarsucursales',
  standalone: true,
  imports: [DxDataGridModule],
  templateUrl: './listarsucursales.component.html',
  styleUrl: './listarsucursales.component.scss'
})
export class ListarsucursalesComponent implements OnInit{


  constructor(private readonly sucursalService :SucursalService){

  }
  ngOnInit(): void {
    this.loadSucursales();
  }
  sucursales!: Sucursal[];

  loadSucursales(){
   this.sucursalService.getSucursales().subscribe((response)=>{
        
      this.sucursales=response;
        console.log(this.sucursales);
    });
   
  }





}
