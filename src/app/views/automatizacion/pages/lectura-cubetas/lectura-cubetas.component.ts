// lectura-cubetas.component.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';
import { LecturaCubetaService } from '../../services/lectura-cubeta.service';
import { codigoCubeta } from '../../models/CodigoCubeta';
import { ProductoCoincidencia } from '../../models/ProductoCoincidencia';
import { DxDataGridModule, DxTemplateModule, DxSelectBoxModule } from 'devextreme-angular';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { ProductoBaseDeDatos } from '../../models/ProductoBD';
import { ProductoService } from '../../services/producto.service';
import { ProductoInsert } from '../../models/ProductoInsert';
import { BotonEnviarCubetaComponent } from '../../components/botonvalidarcubeta/boton-enviar-cubeta.component';

@Component({
  selector: 'app-lectura-cubetas',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    DxDataGridModule,
    DxTemplateModule,
    DxSelectBoxModule,
    BotonEnviarCubetaComponent
  ],
  templateUrl: './lectura-cubetas.component.html',
  styleUrl: './lectura-cubetas.component.scss'
})
export class LecturaCubetasComponent implements OnInit {
  @ViewChild('contenedorScroll') contenedorScroll!: ElementRef;

  productosForm: FormGroup;
  imagenSeleccionada: File | null = null;
  imagenVistaPrevia: string | null = null;
  codigoBarrasDetectado: string | null = null;
  imagenesMultiples: { file: File, preview: string, nombre:string }[] = [];
  productosCubeta: ProductoCoincidencia[] = [];
  productosBD: ProductoBaseDeDatos[] = [];
  productosBDFiltrados: ProductoBaseDeDatos[] = [];
  nombreFiltro: string = '';
  productoSeleccionado: string = '';

  cargando = false;
  cargandoImagenes = false;
  cargandoMatch = false;
  cargandoCubeta = false;

  isDragging = false;
  startX = 0;
  scrollLeft = 0;

  readonly supportedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'];

  constructor(
    private readonly fb: FormBuilder,
    private readonly sweetAlert: SweetAlertService,
    private readonly cdf: ChangeDetectorRef,
    private readonly lecturaCubetaService: LecturaCubetaService,
    private readonly productoService: ProductoService
  ) {
    this.productosForm = this.fb.group({
      imageUpload: [null]
    });
  }

  ngOnInit(): void {
    this.productoService.cargarProductosDB().subscribe({
      next: (data) => {
        this.productosBD = data;
        console.log('Esta es la data del producto que me lleva: ', this.productosBD)
        this.cdf.detectChanges();
      },
      error: () => {
        this.sweetAlert.error('Error', 'No se pudieron cargar los productos desde la base de datos.');
      }
    });
  }

  // Check if all DataGrid rows have valid values
  allFieldsValid(): boolean {
    return this.productosCubeta.length > 0 && this.productosCubeta.every(producto =>
      producto.codigo &&
      producto.codigoBarra &&
      producto.nombre &&
      producto.cantidad !== null && producto.cantidad !== undefined && producto.cantidad > 0
    );
  }

  convertirProductos(data: any[]): { itemcode: string, cantidad: number }[] {
    return data.map(p => ({
      itemcode: p.codigo ?? p.itemcode ?? '',
      cantidad: p.cantidad || 1
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
        this.cdf.detectChanges();
      },
      error: () => {
        this.sweetAlert.error('Error', 'Error al escanear cubeta. Verifica la imagen o la conexión.');
        this.cargando = false;
        this.cdf.detectChanges();
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
        this.imagenesMultiples.push({ file, preview: reader.result as string, nombre:'' as string });
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

    this.cargandoImagenes = true;

    const formData = new FormData();
    this.imagenesMultiples.forEach((img, index) => {
      formData.append(`archivo${index + 1}`, img.file);
    });

    this.lecturaCubetaService.subirImagenesProductosCubeta(formData).subscribe({
      next: (response: ProductoCoincidencia[]) => {
        this.productosCubeta = this.consolidarProductos(response);
        this.productosCubeta = this.productosCubeta.map((producto, index) => ({
          ...producto,
          imagen: this.imagenesMultiples[index]?.preview ?? null
        }));
        this.sweetAlert.exito('Éxito', 'Imágenes adicionales enviadas correctamente.');
        this.cargandoImagenes = false;
        this.cdf.detectChanges();
      },
      error: () => {
        this.sweetAlert.error('Error', 'Hubo un problema al enviar las imágenes.');
        this.cargandoImagenes = false;
        this.cdf.detectChanges();
      }
    });
  }

  private consolidarProductos(productos: ProductoCoincidencia[]): ProductoCoincidencia[] {
    const mapaProductos = new Map<string, ProductoCoincidencia>();
    console.log('Lista de productos matcheados: ', productos)

    productos.forEach((producto) => {
      const nombre = producto.nombre;

      if (mapaProductos.has(nombre)) {
        const productoExistente = mapaProductos.get(nombre)!;
        productoExistente.cantidad = (productoExistente.cantidad || 1) + 1;
      } else {
        mapaProductos.set(nombre, { ...producto, cantidad: 1 });
      }
    });

    console.log('Productos ya matcheados: ', Array.from(mapaProductos.values()))

    return Array.from(mapaProductos.values());
  }

  enviarMatchProducto() {
    const productoSelect = this.productosBDFiltrados.find(p => p.Producto_ID === this.productoSeleccionado);
    const productoGrid = this.productosCubeta.find(p => p.nombre === this.nombreFiltro);

    if (!productoSelect || !productoGrid) {
      this.sweetAlert.error('Error', 'Debe seleccionar un producto del grid y del select.');
      return;
    }

    this.cargandoMatch = true;

    const matchData: ProductoInsert[] = [{
      itemcode: productoSelect.Producto_ID,
      codigobarra: productoSelect.CodBarra,
      descripcionproductobd: productoSelect.Nombre,
      descripcionproductoextraido: productoGrid.nombre
    }];



    this.productoService.insertarProducto(matchData).subscribe({
      next: (data) => {
        if (data.codigo == '400') {
          this.sweetAlert.advertencia('Advertencia', 'El producto ya ha sido enlazado anteriormente.');
        } else {
          this.sweetAlert.exito('Éxito', 'Match enviado correctamente.');
          this.productosCubeta = this.productosCubeta.map(p => 
            p.nombre === this.nombreFiltro ? {
              ...p,
              nombre: productoSelect.Nombre,
              codigo: productoSelect.Producto_ID,
              codigoBarra: productoSelect.CodBarra
            } : p
          );
        this.cdf.detectChanges();

        }
        this.cargandoMatch = false;
        this.cdf.detectChanges();
      },
      error: () => {
        this.sweetAlert.error('Error', 'No se pudo enviar el match.');
        this.cargandoMatch = false;
        this.cdf.detectChanges();
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

  onSelectionChanged(e: DxDataGridTypes.SelectionChangedEvent) {
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

    this.productosBDFiltrados = this.productosBD.filter(producto => {
      const nombreProducto = producto.Nombre.toLowerCase();
      return palabrasClave.some(palabra => nombreProducto.includes(palabra));
    });

    this.productoSeleccionado = this.productosBDFiltrados[0]?.Producto_ID || '';
    this.cdf.detectChanges();
  }

  eliminarProducto(producto: any)
  {

  this.sweetAlert.confirmacion('¿Estás seguro?', 'Esto eliminará el producto seleccionado.').then((confirmado) => {
    if (confirmado) {
      console.log('Esta es la data del producto seleccionado: ', producto)
      console.log('Esta es la data del carrusel de imagenes:; ', this.imagenesMultiples)
      const index = this.productosCubeta.findIndex((p) => p.nombre === producto.nombre)
      if (index !== -1) {
        this.productosCubeta.splice(index, 1)
        this.cdf.detectChanges();
        this.imagenesMultiples = this.imagenesMultiples.filter(item => item.preview !== producto.imagen);

        // Si estás usando un servicio para gestionar los datos, llama al método correspondiente
        // this.productoService.eliminarProducto(producto.id).subscribe(() => {
        //   // Actualizar la vista después de eliminar
        // });
      }
    }
  });
  // Prevenir la propagación del evento para evitar que se seleccione la fila
  // if (confirm(`¿Estás seguro de que deseas eliminar el producto \"${producto.nombre}\"?`)) {
  //   // Aquí implementa la lógica para eliminar el producto
  //   // Por ejemplo:
  //   const index = this.productosCubeta.findIndex((p) => p.nombre === producto.nombre)
  //   if (index !== -1) {
  //     this.productosCubeta.splice(index, 1)
  //     // Si estás usando un servicio para gestionar los datos, llama al método correspondiente
  //     // this.productoService.eliminarProducto(producto.id).subscribe(() => {
  //     //   // Actualizar la vista después de eliminar
  //     // });
  //   }
  // }
}

  onContentReady(e: DxDataGridTypes.ContentReadyEvent) {
    // Implement if needed
  }
}