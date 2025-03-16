import { Component, OnInit } from '@angular/core';
import { DxCommonModule } from '../../shared/DxCommon.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxCountriesDropdownModule } from 'ngx-countries-dropdown';
import { FsGreetingComponent } from "../../shared/utils/fs-greeting/fs-greeting.component";
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [DxCommonModule, CommonModule, NgxCountriesDropdownModule, FsGreetingComponent , RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  selectedCountry = 'HN'; 

countries = [
  { name: 'Honduras', code: 'hn' },
  { name: 'United States', code: 'us' },
  { name: 'Canada', code: 'ca' },
  { name: 'Mexico', code: 'mx' },
  { name: 'Spain', code: 'es' },

];

  activeLink = 'Inicio';
  isWide = false;

  

  setActiveLink(link: string) {
    this.activeLink = link;
  }

  onSearchFocus() {
    this.isWide = true;
  }

  onSearchBlur() {
    this.isWide = false;
  }
}
