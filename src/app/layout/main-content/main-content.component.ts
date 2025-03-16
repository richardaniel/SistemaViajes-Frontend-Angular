import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FsGreetingComponent } from "../../shared/utils/fs-greeting/fs-greeting.component";

interface App {
  name: string;
  status?: string;
  svgViewBox?: string;
  svgBorder?: string;
  subtext?: string;
  isDropdownActive: boolean;
}

@Component({
  selector: 'app-main-content',
  standalone:true,
  imports: [
    CommonModule,
    RouterOutlet,
    FsGreetingComponent,
    
    ],
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent {
  
  mostrarSaludo:boolean = true ;

  constructor(private router :Router){
    this.router.events.subscribe(event =>{
      if(event instanceof NavigationEnd){
        this.mostrarSaludo = false ;
      }
    })
  }
 
  isPopupVisible = false;


  openPopup(app: App) {
    this.isPopupVisible = true;
   
  }

  closePopup() {
    this.isPopupVisible = false;
  }

  
}