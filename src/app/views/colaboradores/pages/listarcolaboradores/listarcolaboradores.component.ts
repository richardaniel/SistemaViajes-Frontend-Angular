import { Component, OnInit } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular';
import { Colaborador } from '../../models/Colaborador';
import { ColaboradorService } from '../../services/colaborador.service';

@Component({
  selector: 'app-listarcolaboradores',
  standalone: true,
  imports: [DxDataGridModule],
  templateUrl: './listarcolaboradores.component.html',
  styleUrl: './listarcolaboradores.component.scss'
})
export class ListarcolaboradoresComponent implements OnInit {

  constructor(private readonly colaboradorService : ColaboradorService){
      
  }
  ngOnInit(): void {
    this.loadColaboradores();
  }


  colaboradores:Colaborador []= [];

  async loadColaboradores(){
    await this.colaboradorService.getColaboradores().subscribe((response)=>{
        this.colaboradores=response;
        console.log(this.colaboradores);
    });
   
  }
  
 }
