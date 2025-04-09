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
        this.productos = data.filter(x =>{
          return x.Nombre.includes("CALMOL")
        })
        console.log('La data de productos es: ', this.productos)
        console.log('La data de productos de data es: ', data.slice(0, 100))
        this.cdf.detectChanges();
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
        console.log(respuesta);
        this.sweetAlert.exito('Éxito', 'Coincidencias encontradas correctamente.');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error detecting products:', err);
        this.sweetAlert.error('Error', 'Error al detectar productos. Verifica la imagen o la conexión.');
        this.isLoading = false;
      }
    });
  }

  onSeleccionProducto(e: DxDataGridTypes.SelectionChangedEvent) {
    const nombreSeleccionado = e.selectedRowsData[0]?.Nombre;
    if (!nombreSeleccionado) return;

    this.productos = [
      { Producto_ID: 'P001', Nombre: nombreSeleccionado, CodBarra: '1234567890' }
    ];
    this.productoSeleccionado = this.productos[0].Producto_ID;
  }

  escucharElOnchange(event:any){
    console.log('Esto me llevalos logs: ', event);
    
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    
    // Validate file type
    if (!this.supportedImageTypes.includes(file.type)) {
      this.sweetAlert.error('Error', 'Formato de imagen no soportado. Use JPEG, PNG, GIF o BMP.');
      return;
    }

    // Validate file size (e.g., 5MB max)
    if (file.size > 5 * 1024 * 1024) {
      this.sweetAlert.error('Error', 'La imagen es demasiado grande. Tamaño máximo: 5MB.');
      return;
    }

    this.imagenSeleccionada = file;
    
    // Create preview
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
}