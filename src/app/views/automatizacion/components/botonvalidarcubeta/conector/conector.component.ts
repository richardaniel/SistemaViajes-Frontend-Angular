import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxSelectBoxModule } from 'devextreme-angular';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { ProductoBaseDeDatos } from '../../models/ProductoBD';
import { NombreProductoCoincidencia } from '../../models/NombreProductoCoincidencia';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';
import { ProductoService } from '../../services/producto.service';
import { ProductoInsert } from '../../models/ProductoInsert';

@Component({
  selector: 'app-conector',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, DxDataGridModule, DxSelectBoxModule],
  templateUrl: './conector.component.html',
  styleUrl: './conector.component.scss'
})
export class ConectorComponent implements OnInit {
  productosForm: FormGroup;
  imagenSeleccionada: File | null = null;
  imagenVistaPrevia: string | null = null;
  isLoading = false;

  productosCoincidencia: NombreProductoCoincidencia[] = [];
  productos!: ProductoBaseDeDatos[];
  productoSeleccionado: string = '';
  nombreFiltro: string = '';
  productosFiltrados: ProductoBaseDeDatos[] = [];



  // Supported image types
  readonly supportedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'];

  constructor(
    private readonly fb: FormBuilder,
    private readonly sweetAlert: SweetAlertService,
    private readonly productoService: ProductoService,
    private readonly cdf: ChangeDetectorRef
  ) {
    this.productosForm = this.fb.group({
      imageUpload: [null]
    });
  }

  ngOnInit() {
    this.productoService.cargarProductosDB().subscribe({
      next: (data) => {
        this.productos = data
        
        console.log('La data de productos es: ', this.productos)
        console.log('La data de productos de data es: ', data.slice(0, 100))
        
      },
      error: () => {
        this.sweetAlert.error('Error', 'No se pudieron cargar los productos desde la base de datos.');
      }
    });
  }
  

  onSubmit() {
    if (!this.imagenSeleccionada) {
      this.sweetAlert.error('Error', 'Debes seleccionar una imagen.');
      return;
    }

    this.isLoading = true;
    
    this.productoService.detectarProducto(this.imagenSeleccionada).subscribe({
      next: (respuesta) => {
        this.productosCoincidencia = respuesta;


        if(respuesta.length <= 0 || respuesta == null){
          this.isLoading = false;
          return this.sweetAlert.error('Error', 'Error al detectar productos. Verifica la imagen o la conexión.')
        }else {
          this.sweetAlert.exito('Éxito', 'Coincidencias encontradas correctamente.');
        this.isLoading = false;
        }
        
        
      },
      error: (err) => {
        console.error('Error detecting products:', err);
        this.sweetAlert.error('Error', 'Error al detectar productos. Verifica la imagen o la conexión.');
        this.isLoading = false;
      }
    });
  }

  onSeleccionProducto(e: DxDataGridTypes.SelectionChangedEvent) {
    
    const filaSeleccionada = e.selectedRowsData[0];
    
    if (!filaSeleccionada) {
     
      this.productosFiltrados = [];
      this.productoSeleccionado = '';
      this.cdf.detectChanges();
      return;
    }
  
    this.nombreFiltro = filaSeleccionada.nombre;
    
    const palabrasClave = this.nombreFiltro
      .toLowerCase()
      .replace(/[-\s]+/g, ' ') 
      .split(' ')
      .filter(palabra => palabra.length > 3); 
  
    console.log('Palabras clave extraídas:', palabrasClave);
  
   
    this.productosFiltrados = this.productos.filter(producto => {
      const nombreProducto = producto.Nombre.toLowerCase();
      const coincide = palabrasClave.some(palabra => nombreProducto.includes(palabra));
     
      return coincide;
    });
  
   
  
    this.productoSeleccionado = this.productosFiltrados[0]?.Producto_ID || '';
    this.cdf.detectChanges();
  }
  

  escucharElOnchange(event:any){
  
    
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    
  
    if (!this.supportedImageTypes.includes(file.type)) {
      this.sweetAlert.error('Error', 'Formato de imagen no soportado. Use JPEG, PNG, GIF o BMP.');
      return;
    }
    this.imagenSeleccionada = file;
    
    const reader = new FileReader();
    reader.onload = () => {
      this.imagenVistaPrevia = reader.result as string;
    };
    reader.onerror = () => {
      console.error('Error reading file');
      this.sweetAlert.error('Error', 'No se pudo leer la imagen seleccionada.');
    };
    reader.readAsDataURL(file);
  }



  enviarMatchProducto() {
    const productoSelect = this.productosFiltrados.find(p => p.Producto_ID === this.productoSeleccionado);
    const productoGrid = this.productosCoincidencia.find(p => p.nombre === this.nombreFiltro);
  
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
  
}