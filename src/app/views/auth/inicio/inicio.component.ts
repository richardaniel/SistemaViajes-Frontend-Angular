import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FsAuthService } from '@farsiman/idf-angular';
import { FsGreetingComponent } from "../../../shared/utils/fs-greeting/fs-greeting.component";

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FsGreetingComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit {
  constructor( public readonly fsAuthService: FsAuthService ){
    
  }
  ngOnInit(): void {
    
  }
}
