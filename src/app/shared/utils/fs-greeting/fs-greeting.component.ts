import { Component, Input, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';


export enum TipoSaludoEnum {
  Morning = 1,
  Afternoon = 2,
  Evening = 3,
}

@Component({
    selector: 'fs-greeting',
    templateUrl: './fs-greeting.component.html',
    styleUrls: ['./fs-greeting.component.scss'],
    standalone: true,
    imports: [NgIf]
})
export class FsGreetingComponent implements OnInit {
  @Input() name: string = ''
  tipoSaludo: number = 0;
  tipoSaludoEnum = TipoSaludoEnum;
  currentHour: number = 0;
  timeOfDay: string = '';
  currentImg: string = '';
  currentIcon: string = '';
  currentClass: string = '';



  constructor() { }


  ngOnInit() {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    this.currentHour = currentHour;

    if (currentHour > 3 && currentHour < 12) {
      this.timeOfDay = "Buenos días ";
      this.currentClass = "morning"
      this.currentIcon = "dx-icon-sun"
      this.tipoSaludo = TipoSaludoEnum.Morning;
    }
    else if (currentHour >= 12 && currentHour < 18) {
      this.timeOfDay = "Buenas tardes ";
      this.currentClass = "afternoon"
      this.currentIcon = "dx-icon-sun"
      this.tipoSaludo = TipoSaludoEnum.Afternoon;
    }
    else if (currentHour >= 18 || currentHour <= 3) {
      this.timeOfDay = "Buenas noches ";
      this.currentClass = "evening"
      this.currentIcon = "dx-icon-moon"
      this.tipoSaludo = TipoSaludoEnum.Evening;
    }

    if (currentHour >= 6 && currentHour < 11)
      
      this.currentImg = '././assets/img/welcome/time-day-1.png';
    else if (currentHour >= 11 && currentHour < 17)
      this.currentImg = '././assets/img/welcome/time-day-2.png';
    else if (currentHour >= 17 && currentHour < 18)
      this.currentImg = '././assets/img/welcome/time-day-3.png';
    else if (currentHour >= 18 && currentHour < 19)
      this.currentImg = './.assets/img/welcome/time-day-4.png';
    else if (currentHour >= 19 || currentHour < 4)
      this.currentImg = './.assets/img/welcome/time-day-5.png';
    else if (currentHour >= 4 && currentHour < 6)
      this.currentImg = './.assets/img/welcome/time-day-6.png';
  }

}
