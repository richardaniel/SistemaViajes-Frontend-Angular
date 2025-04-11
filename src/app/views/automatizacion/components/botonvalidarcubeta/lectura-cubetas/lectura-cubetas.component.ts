// lectura-cubetas.component.ts (remains the same as previous version)
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, ViewChild ,NgModule, enableProdMode, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SweetAlertService } from '../../../../../shared/services/sweet-alert.service';
import { LecturaCubetaService } from '../../../services/lectura-cubeta.service';
import { codigoCubeta } from '../../../models/CodigoCubeta';
import { ProductoCoincidencia } from '../../../models/ProductoCoincidencia';
import { DxDataGridModule, DxTemplateModule ,DxFormModule, DxSelectBoxModule, DxTabPanelModule, } from 'devextreme-angular';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';


import { } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import DataSource from 'devextreme/data/data_source';
import { ProductoBaseDeDatos } from '../../../models/ProductoBD';
import { ProductoService } from '../../../services/producto.service';
import { ProductoInsert } from '../../../models/ProductoInsert';
//import { DetailViewComponent } from './detail-view/detail-view.component';
import { BotonEnviarCubetaComponent} from '../boton-enviar-cubeta.component';




@Component({
  selector: 'app-lectura-cubetas',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule , DxDataGridModule,DxTemplateModule ,DxSelectBoxModule, BotonEnviarCubetaComponent ],
  templateUrl: './lectura-cubetas.component.html',
  styleUrl: './lectura-cubetas.component.scss'
})
export class LecturaCubetasComponent  implements OnInit{
  @ViewChild('contenedorScroll') contenedorScroll!: ElementRef;

  productosForm: FormGroup;
  imagenSeleccionada: File | null = null;
  imagenVistaPrevia: string | null = null;
  codigoBarrasDetectado: string | null = null;
  imagenesMultiples: { file: File, preview: string }[] = [];
  cargando = false;
  productosBD!: ProductoBaseDeDatos[];
  productosBDFiltrados !: ProductoBaseDeDatos [];
  nombreFiltro: string = '';
  productoSeleccionado: string = '';
  productosCubeta!: ProductoCoincidencia[];

  isDragging = false;
  startX = 0;
  scrollLeft = 0;

  readonly supportedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'];


  constructor(
    private readonly fb: FormBuilder,
    private readonly sweetAlert: SweetAlertService,
    private readonly cdf: ChangeDetectorRef,
    private readonly lecturaCubetaService: LecturaCubetaService,
    private readonly productoService : ProductoService
  ) {
    this.productosForm = this.fb.group({
      imageUpload: [null]
    });
  }
  ngOnInit(): void {
    this.productoService.cargarProductosDB().subscribe({
      next: (data) => {
        this.productosBD = data
   
        console.log('La data de productos de data es: ', data.slice(0, 100))
        
      },
      error: () => {
        this.sweetAlert.error('Error', 'No se pudieron cargar los productos desde la base de datos.');
      }
    });
  }

  convertirProductos(data: any[]): { itemcode: string, cantidad: number }[] {
    // Transforma tu array 'productosCubeta' para que encaje
    // con la interfaz del componente hijo
    return data.map(p => ({
      itemcode: p.codigo ?? p.itemcode ?? '',
      cantidad: 1 
    }));
  }
  
  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (!this.supportedImageTypes.includes(file.type)) {
      this.sweetAlert.error('Error', 'Formato de imagen no soportado. Use JPEG, PNG, GIF o BMP.');
      return;
    }

    this.imagenSeleccionada = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagenVistaPrevia = reader.result as string;
      this.cdf.detectChanges();
    };

    reader.onerror = () => {
      this.sweetAlert.error('Error', 'No se pudo leer la imagen seleccionada.');
    };

    reader.readAsDataURL(file);
  }

  enviarCodigoCubeta() {
    if (!this.imagenSeleccionada) {
      this.sweetAlert.error('Error', 'Debes seleccionar una imagen.');
      return;
    }

    this.cargando = true;

    this.lecturaCubetaService.detectarCodigoBarras(this.imagenSeleccionada).subscribe({
      next: (respuesta: codigoCubeta[]) => {
        this.codigoBarrasDetectado = respuesta[0].codigo_cubeta;
        this.sweetAlert.exito('Éxito', 'Código escaneado correctamente.');
        this.cargando = false;
      },
      error: () => {
        this.sweetAlert.error('Error', 'Error al escanear cubeta. Verifica la imagen o la conexión.');
        this.cargando = false;
      }
    });
  }

  onSeleccionarMultiplesImagenes(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!this.supportedImageTypes.includes(file.type)) {
        this.sweetAlert.error('Error', `Formato no válido: ${file.name}`);
        continue;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.imagenesMultiples.push({ file, preview: reader.result as string });
        this.cdf.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  eliminarImagen(index: number): void {
    this.imagenesMultiples.splice(index, 1);
    this.cdf.detectChanges();
  }

  enviarImagenesAdicionales() {
    if (this.imagenesMultiples.length === 0 || !this.codigoBarrasDetectado) {
      this.sweetAlert.error('Error', 'No hay imágenes para enviar o falta el código de cubeta.');
      return;
    }
  
    const formData = new FormData();
    this.imagenesMultiples.forEach((img, index) => {
      formData.append(`archivo${index + 1}`, img.file);
    });
    
  
    this.lecturaCubetaService.subirImagenesProductosCubeta(formData).subscribe({
      next: (response) => {
        console.log(response)
        this.productosCubeta = response ;


         // --JUST CAREFUL THIS ELIMINAR SI EL ORDEN DEVUELTO NO COINCIDE 
      this.productosCubeta = response.map((producto, index) => ({
        ...producto,
        imagen: this.imagenesMultiples[index]?.preview ?? null
      }));

      console.log('Asi me lleva la data de los productos: ', this.productosCubeta)

        this.sweetAlert.exito('Éxito', 'Imágenes adicionales enviadas correctamente.');
      },
      error: () => {
        this.sweetAlert.error('Error', 'Hubo un problema al enviar las imágenes.');
      }
    });
  }

  onContentReady(e: DxDataGridTypes.ContentReadyEvent) {

    

    
    console.log('Esto me lleva el metodo onContentReady: ', e.element.outerText)

    let encontroEncabezado = false;
  
    for (const linea of e.element.outerText) {
      // Verificar si es la línea de encabezado "Nombre del Producto"
      if (linea.includes('Nombre del Producto')) {
        encontroEncabezado = true;
        continue;
      }
      
      // Si ya encontramos el encabezado, la siguiente línea no vacía debería ser nuestro medicamento
      if (encontroEncabezado && linea.trim()) {
        console.log('Nombre producto encontrado: ', linea.trim())
      }

     
    }
    
  }

  onSelectionChanged(e: DxDataGridTypes.SelectionChangedEvent) {
  
    
    console.log('Esto me lleva el metodo onSelectionChanged: ', e)
    const filaSeleccionada = e.selectedRowsData[0];
    this.productosBDFiltrados = [];

    if (!filaSeleccionada) {
     
      this.productosBDFiltrados = [];
      this.productoSeleccionado = '';
     
      return;
    }
  
    this.nombreFiltro = filaSeleccionada.nombre;
    
    const palabrasClave = this.nombreFiltro
      .toLowerCase()
      .replace(/[-\s]+/g, ' ') 
      .split(' ')
      .filter(palabra => palabra.length > 3); 
  
    console.log('Palabras clave extraídas:', palabrasClave);
  
   
    this.productosBDFiltrados = this.productosBD.filter(producto => {
      const nombreProducto = producto.Nombre.toLowerCase();
      const coincide = palabrasClave.some(palabra => nombreProducto.includes(palabra));
     
      return coincide;
    });
  
  
    this.productoSeleccionado = this.productosBDFiltrados[0]?.Producto_ID || '';
   

  }
  enviarMatchProducto() {
      const productoSelect = this.productosBDFiltrados.find(p => p.Producto_ID === this.productoSeleccionado);
      const productoGrid = this.productosCubeta.find(p => p.nombre === this.nombreFiltro);
    
      if (!productoSelect || !productoGrid) {
        this.sweetAlert.error('Error', 'Debe seleccionar un producto del grid y del select.');
        return;
      }
    
      const matchData: ProductoInsert[] = [{
        itemcode: productoSelect.Producto_ID,
        codigobarra: productoSelect.CodBarra,
        descripcionproductobd: productoSelect.Nombre,
        descripcionproductoextraido: productoGrid.nombre
      }];
      
      this.productosCubeta.filter(p => p.nombre === this.nombreFiltro)
      .map(producto => ({
        ...producto,
        nombre: productoSelect.Nombre,
        codigo: productoSelect.Producto_ID,
        codigoBarra: productoSelect.CodBarra
      }))

      console.log('Asi me retorna los productos ya macheados: ', this.productosCubeta)
  
      
      console.log(matchData);
    
      this.productoService.insertarProducto(matchData).subscribe({
        next: (data) => {
  
          if(data.codigo=='400'){
            this.sweetAlert.advertencia('Advertencia', 'El producto ya ha sido enlazado anteriormente.');
          }else{
            this.sweetAlert.exito('Éxito', 'Match enviado correctamente.');
          }
          
        },
        error: (err) => {
          console.error('Error al enviar match:', err);
          this.sweetAlert.error('Error', 'No se pudo enviar el match.');
        }
      });
    }

  nuevoEscaneo() {
    this.sweetAlert.confirmacion('¿Estás seguro?', 'Esto eliminará todo el contenido actual.').then((confirmado) => {
      if (confirmado) {
        this.imagenVistaPrevia = null;
        this.codigoBarrasDetectado = null;
        this.imagenesMultiples = [];
        this.productosCubeta = [];
        this.productosForm.reset();
        this.cdf.detectChanges();
      }
    });
  }

  onDragStart(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.pageX - this.contenedorScroll.nativeElement.offsetLeft;
    this.scrollLeft = this.contenedorScroll.nativeElement.scrollLeft;
  }

  onDragEnd() {
    this.isDragging = false;
  }

  onDragMove(event: MouseEvent) {
    if (!this.isDragging) return;
    event.preventDefault();
    const x = event.pageX - this.contenedorScroll.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 2;
    this.contenedorScroll.nativeElement.scrollLeft = this.scrollLeft - walk;
  }
}