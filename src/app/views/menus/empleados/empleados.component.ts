import { Component, OnInit, ViewChild } from '@angular/core';
import { GmapComponent } from '../../controls/gmap/gmap.component';
import { Result } from '../../../models/Result';
import { Empresa } from './../../../models/Empresa';
import { EmpresasService } from '../../../services/empresas.service';
import { MapService } from '../../../services/map.service';
import { UtilService } from '../../../services/util.service';
import { Empleado } from '../../../models/Empleado';
import { PhotoUploaderComponent } from './../../controls/photo-uploader/photo-uploader.component';
import { EmpleadosService } from './../../../services/empleados.service';
import { Subject } from 'rxjs/Subject';
import { Servicio } from '../../../models/Servicio';
import { ServiciosService } from '../../../services/servicios.service';

declare var $;
declare var Foundation;
declare var google;

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {

  //#region componentes

  @ViewChild('mapServicios') mapaComponent: GmapComponent;
  @ViewChild('photo') photoComponent: PhotoUploaderComponent;

  //#endregion

  loading = new Subject<number>();

  empresas: any = [];
  empleados: any = [];
  servicios: Array<Servicio>;

  empleadoSeleccionado: Empleado = new Empleado();
  nuevoEmpleado: Empleado = new Empleado();
  nuevoServicio: Servicio = new Servicio();

  fecha_inicial: any;
  fecha_final: any;


  filtro: string;
  FiltroEmpresaID = -1;
  FiltroServicios = '';
  // #region modals

  modalName = 'ModalNuevoEditar';
  modalID = '#' + this.modalName;

  modalServicesName = 'ModalAsignarServicio';
  modalServicesID = '#' + this.modalServicesName;

  modalServiciosAsignadosName = 'ModalServicio';
  modalServiciosAsignadosID = '#ModalServicio';

  // #endregion

  files: FileList;
  rootImage = 'http://localhost:58979/';

  EditMode = false;

  constructor
    (
    private empSVC: EmpresasService,
    private emplSVC: EmpleadosService,
    private mapSVC: MapService,
    private serviceSVC: ServiciosService,
    public util: UtilService
    ) { }

  GetEmpresas() {
    const that = this;
    this.empSVC.all().subscribe(s => {
      this.empresas = s;
      this.nuevoEmpleado.id_empresa = this.empresas[0].id;
    });


    this.emplSVC.getEmpleados().subscribe(s => {
      this.empleados = s;
      console.log(s);
    });
  }

  onOpenModalServicio() {
    const that = this;
    return (modal) => {
      that.mapaComponent.InitMap();
      console.log('se inicializo correctamente');
    };
  }

  ModalInit() {
    this.util.initModal(this.modalName);
    this.util.initModal(this.modalServicesName, this.onOpenModalServicio());
    this.util.initModal(this.modalServiciosAsignadosName);
  }

  ngOnInit() {
    this.GetEmpresas();
    this.ModalInit();
  }


  AsignarServicio(emp: Empleado) {
    const time = this.util.getTime();
    const empresaName = this.empSVC.getNameEmpresa(emp.id_empresa, this.empresas);
    if (empresaName === null) { return; }

    this.nuevoServicio.estado = 0;
    this.nuevoServicio.hora = Number(time.split(':')[0]);
    this.nuevoServicio.minutos = Number(time.split(':')[1]);
    this.nuevoServicio.duracion = Number(60);
    this.nuevoServicio.id_empleado = emp.id;
    this.nuevoServicio.id_empresa = emp.id_empresa;
    this.nuevoServicio.nombreEmpleado = emp.nombres.toUpperCase() + ' ' + emp.apellidos.toUpperCase();
    this.nuevoServicio.date = this.util.getActualDate();
    this.nuevoServicio.nombreEmpresa = empresaName;

    $(this.modalServicesID).foundation('open');
  }

  CancelarAsignarServicio() {
    $(this.modalServicesID).foundation('close');
  }

  GuardarAsignacion() {

    const position = this.mapaComponent.GetMarker();

    if (position === null) {
      this.util.showWarning('Debe seleccionar una ubicacion');
      return;
    }

    const isValid = this.nuevoServicio.IsValid();
    if (!isValid.response) {
      this.util.showWarning(isValid.mensaje);
      return;
    }

    const res = this.util.Str2Date(this.nuevoServicio.date, this.nuevoServicio.hora, this.nuevoServicio.minutos);
    if (res.IsOk) {
      this.nuevoServicio.fecha = res.Data;
    }

    this.nuevoServicio.latitud = position.lat();
    this.nuevoServicio.longitud = position.lng();

    this.serviceSVC.GuardarServicio(this.nuevoServicio).subscribe((s: Result<string>) => {
      if (s.IsOk) {
        this.util.showSuccess('Registro exitoso');
        $(this.modalServicesID).foundation('close');
      } else {
        this.util.showErrorTitle('Error', s.Data);
      }
    });
  }

  SeleccionoEmpresa(value) {
    this.nuevoEmpleado.id_empresa = value;
  }

  FiltroEmpresa(value) {
    this.FiltroEmpresaID = value;
  }

  ShowCrearEmpleado() {
    this.EditMode = false;
    this.nuevoEmpleado = new Empleado();
    this.photoComponent.ClearPhoto();
    $('#ModalNuevoEditar').foundation('open');
  }

  showEditarEmpleado(emp: Empleado) {
    this.EditMode = true;
    this.nuevoEmpleado = emp;
    this.photoComponent.SetPhoto(this.rootImage + emp.foto);
    $('#ModalNuevoEditar').foundation('open');
  }

  showServicios(emp: Empleado) {
    this.servicios = [];
    this.fecha_inicial = this.util.getActualDate();
    this.fecha_final = this.util.getActualDate();
    this.empleadoSeleccionado = emp;
    this.empleadoSeleccionado.nombreEmpleado = emp.nombres.toUpperCase() + ' ' + emp.apellidos.toUpperCase();
    this.empleadoSeleccionado.nombreEmpresa = this.empSVC.getNameEmpresa(emp.id_empresa, this.empresas);

    $(this.modalServiciosAsignadosID).foundation('open');
  }

  Guardar() {
    const foto = this.photoComponent.GetPhoto();
    const formData: FormData = new FormData();
    formData.append('imagen', foto);
    formData.append('empleado', JSON.stringify(this.nuevoEmpleado));
    this.emplSVC.guardarEmpleados(formData).subscribe((s: Result<Empleado>) => {
      if (s.IsOk) {
        this.util.showSuccess('Empleado Registrado exitosamente');
        this.GetEmpresas();
        $(this.modalID).foundation('close');
      } else {
        this.util.showErrorTitle('Error', s.Mensaje);
      }
    });
  }

  Actualizar() {
    const foto = this.photoComponent.GetPhoto();
    const formData: FormData = new FormData();
    formData.append('imagen', foto);
    formData.append('empleado', JSON.stringify(this.nuevoEmpleado));
    this.emplSVC.ActualizarEmpleado(this.nuevoEmpleado.id, formData).subscribe((s: Result<Empleado>) => {
      if (s.IsOk) {
        this.util.showSuccess('Empleado Actualizado exitosamente');
        this.GetEmpresas();
        $(this.modalID).foundation('close');
      } else {
        this.util.showErrorTitle('Error', s.Mensaje);
      }
    });
  }

  limpiar() {
    this.nuevoEmpleado = new Empleado();
    $(this.modalID).foundation('close');
  }

  cargarServicios() {
    console.log(this.empleadoSeleccionado);
    this.serviceSVC.ObtenerServicios(this.empleadoSeleccionado.id, this.fecha_inicial, this.fecha_final)
      .subscribe((s: Result<Servicio[]>) => {
        if (s.IsOk){
          this.servicios = s.Data.map(m => {
            if (m.observacion === null){
              m.observacion = 'ninguna';
            }
            m.estadoTexto =  this.util.ParseEstadoServicio(m.estado);
            return m;
          });
        } else{
          this.util.showWarning('no exiten servicios registrados en el intervalo de fecha establecido');
        }
      });
  }

  showLocationService(servicio: Servicio){
  }
}
