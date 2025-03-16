import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DevExtremeModule } from 'devextreme-angular';
import { HeaderComponent } from "./layout/header/header.component";
import { MainContentComponent } from "./layout/main-content/main-content.component";
import { LayoutComponent } from "./layout/layout/layout.component";
import { FsAuthService } from '@farsiman/idf-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DevExtremeModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

   constructor(private readonly _fsAuthService : FsAuthService){
     this._fsAuthService.useFsAuthServiceAsync();
     console.log(this._fsAuthService.currentUser)
   }
  title = 'Richar.Academia.ProyectoFinal.AngularClient';

  
}
