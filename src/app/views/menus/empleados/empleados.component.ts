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
import { ModalHandler } from './../../../util/modalHandler';
import { Cliente } from '../../../models/Cliente';
import { ClientesService } from '../../../services/clientes.service';

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

  @ViewChild('mapEmpleado') mapaEmpleado: GmapComponent;
  @ViewChild('mapServicios') mapaComponent: GmapComponent;
  @ViewChild('mapEmpServicio') mapaEmpServicio: GmapComponent;
  @ViewChild('photo') photoComponent: PhotoUploaderComponent;

  //#endregion

  nuevaMac = '';

  loading = new Subject<number>();

  clientes: Cliente[];
  empresas: any = [];
  empleados: any = [];
  servicios: Array<Servicio>;

  empleadoSeleccionado: Empleado = new Empleado();
  nuevoEmpleado: Empleado = new Empleado();
  nuevoServicio: Servicio = new Servicio();
  SelectedService: Servicio;

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

  modalSetMacName = 'ModalMac';
  modalSetMacID = '#' + this.modalSetMacName;

  mdl_position: ModalHandler;
  mdl_photo: ModalHandler;
  mdl_pos_svc: ModalHandler;

  // #endregion

  files: FileList;
  rootImage = this.util.hostProd;

  EditMode = false;

  constructor
    (
    private empSVC: EmpresasService,
    private emplSVC: EmpleadosService,
    private mapSVC: MapService,
    private serviceSVC: ServiciosService,
    public util: UtilService,
    private cltSVC: ClientesService
    ) { }

  InitClientes() {
    this.cltSVC.GetClientes().subscribe((res: Result<Cliente[]>) => {
      if (res.IsOk) {
        this.clientes = res.Data;
      } else {
        this.util.showError(res.Mensaje);
      }
    });
  }

  GetEmpleados() {
    this.emplSVC.getEmpleados().subscribe((s: Empleado[]) => {
      this.empleados = s.map(
        m => {
          if (m.pulsera === undefined || m.pulsera === '' || m.pulsera === null) { m.pulsera = 'no registra'; }
          return m;
        }
      );
    });
  }

  GetEmpresas() {
    const that = this;
    this.empSVC.all().subscribe(s => {
      this.empresas = s;
      this.nuevoEmpleado.id_empresa = this.empresas[0].id;
    });

    that.GetEmpleados();
    setInterval(() => {
      that.GetEmpleados();
    }, 1000 * 10);
  }

  ModalInit() {
    this.util.initModal(this.modalName);
    this.util.initModal(this.modalServicesName, (modal) => { this.mapaComponent.InitMap(); });
    this.util.initModal(this.modalServiciosAsignadosName);
    this.util.initModal(this.modalSetMacName);
    this.mdl_photo = new ModalHandler('ModalPhoto');
    this.mdl_position = new ModalHandler('ModalEmpleadoPosicion', (modal) => {
      this.mapaEmpleado.InitMap();

      const isValid = (this.empleadoSeleccionado.Latitud != null) && (this.empleadoSeleccionado.Longitud != null);

      if (isValid) {
        console.log('es valido');
        const lat = this.empleadoSeleccionado.Latitud;
        const lng = this.empleadoSeleccionado.Longitud;
        this.mapaEmpleado.SetMarker(lat, lng);
      } else {
        console.log('no es valido');
        this.util.showError('El empleado no reporta ubicacion');
      }
    });

    this.mdl_pos_svc = new ModalHandler('ModalServicioPosicion', (modal) => {
      this.mapaEmpServicio.InitMap();
      const isValid = (this.SelectedService.latitud != null) && (this.SelectedService.longitud != null);

      if (isValid) {
        console.log('es valido');
        const lat = this.SelectedService.latitud;
        const lng = this.SelectedService.longitud;
        this.mapaEmpServicio.SetMarker(lat, lng);
      } else {
        console.log('no es valido');
        this.util.showError('El servicio no tiene una ubicacion valida');
      }
    });
  }

  ngOnInit() {
    this.InitClientes();
    this.GetEmpresas();
    this.ModalInit();
  }

  AsignarServicio(emp: Empleado) {

    const time = this.util.getTime();

    this.nuevoServicio.estado = 0;
    this.nuevoServicio.hora = Number(time.split(':')[0]);
    this.nuevoServicio.minutos = Number(time.split(':')[1]);
    this.nuevoServicio.duracion = Number(60);
    this.nuevoServicio.id_empleado = emp.id;
    this.nuevoServicio.id_empresa = emp.id_empresa;
    this.nuevoServicio.nombreEmpleado = emp.nombres.toUpperCase() + ' ' + emp.apellidos.toUpperCase();

    this.nuevoServicio.date = this.util.getActualDate();
    const empresaName = this.empSVC.getNameEmpresa(emp.id_empresa, this.empresas);
    if (empresaName === null) { return; }
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

  Eliminar() {
    this.emplSVC.EliminarEmpleado(this.nuevoEmpleado.id)
    .subscribe((s: Result<Empleado>) => {
      if (s.IsOk) {
        this.util.showSuccess('Empleado eliminado exitosamente');
        this.GetEmpresas();
        $(this.modalID).foundation('close');
      }else {
        this.util.showError(s.Mensaje);
      }
    });
  }

  limpiar() {
    this.nuevoEmpleado = new Empleado();
    $(this.modalID).foundation('close');
  }

  cargarServicios() {
    this.serviceSVC.ObtenerServicios(this.empleadoSeleccionado.id, this.fecha_inicial, this.fecha_final)
      .subscribe((s: Result<Servicio[]>) => {
        if (s.IsOk) {
          this.servicios = s.Data.map(m => {
            if (m.observacion === null) {
              m.observacion = 'ninguna';
            }
            m.estadoTexto = this.util.ParseEstadoServicio(m.estado);
            return m;
          });
        } else {
          this.util.showWarning('no exiten servicios registrados en el intervalo de fecha establecido');
        }
      });
  }

  showLocationService(servicio: Servicio) {
  }

  CambiarMac(emp) {
    this.empleadoSeleccionado = emp;
    this.empleadoSeleccionado.nombreEmpleado = emp.nombres.toUpperCase() + ' ' + emp.apellidos.toUpperCase();
    this.empleadoSeleccionado.nombreEmpresa = this.empSVC.getNameEmpresa(emp.id_empresa, this.empresas);
    $(this.modalSetMacID).foundation('open');
  }

  CancelarNuevaMac() {
    $(this.modalSetMacID).foundation('close');
  }

  GuardarMac() {
    if (this.nuevaMac.length < 17) {
      this.util.showError('formato invalido');
      return;
    }

    if (this.nuevaMac.split(':').length < 5) {
      this.util.showError('formato invalido');
      return;
    }

    this.emplSVC.SaveMac(this.empleadoSeleccionado.id, this.nuevaMac)
      .subscribe(
        (s: Result<Empleado>) => {
          if (s.IsOk) {
            this.util.showSuccess('Mac actualizada exitosamente');
          } else {
            this.util.showError(s.Mensaje);
          }

          $(this.modalSetMacName).foundation('close');
        });

  }

  ShowPhoto(emp: Empleado) {
    this.empleadoSeleccionado = emp;
    this.empleadoSeleccionado.nombreEmpleado = emp.nombres.toUpperCase() + ' ' + emp.apellidos.toUpperCase();
    this.mdl_photo.Show();
  }

  ShowPosition(emp: Empleado) {
    this.empleadoSeleccionado = emp;
    this.empleadoSeleccionado.nombreEmpleado = emp.nombres.toUpperCase() + ' ' + emp.apellidos.toUpperCase();
    this.mdl_position.Show();
  }

  ShowPositionServices(svc: Servicio) {
    this.SelectedService = svc;
    this.mdl_pos_svc.Show();
  }

  SelectedCliente(value) {
    this.nuevoServicio.cliente = value;
  }
}
