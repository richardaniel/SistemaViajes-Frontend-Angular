import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { MainContentComponent } from "../main-content/main-content.component";
import { FsGreetingComponent } from "../../shared/utils/fs-greeting/fs-greeting.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, MainContentComponent, FsGreetingComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  isOverlayActive = false;

  toggleDarkMode() {
    document.body.classList.toggle('light-mode');
  }

  // Método para controlar el overlay desde componentes hijos si es necesario
  toggleOverlay(active: boolean) {
    this.isOverlayActive = active;
  }
}
