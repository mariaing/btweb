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

declare var $;
declare var Foundation;
declare var google;

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {

  @ViewChild('mapServicios') mapaComponent: GmapComponent;
  @ViewChild('photo') photoComponent: PhotoUploaderComponent;

  loading = new Subject<number>();

  empresas: any = [];
  empleados: any = [];

  nuevoEmpleado: Empleado = new Empleado();
  nuevoServicio: Servicio = new Servicio();
  filtro: string;
  FiltroEmpresaID = -1;

  modalName = 'ModalNuevoEditar';
  modalID = '#' + this.modalName;

  modalServicesName = 'ModalAsignarServicio';
  modalServicesID = '#' + this.modalServicesName;

  files: FileList;
  rootImage = 'http://localhost:58979/';

  EditMode = false;

  constructor
    (
    private empSVC: EmpresasService,
    private emplSVC: EmpleadosService,
    private mapSVC: MapService,
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
    });
  }

  onOpenModalServicio(){
    const that = this;
    return (modal) => {
      that.mapaComponent.InitMap();
      console.log('se inicializo correctamente');
    };
  }

  ModalInit() {    
    this.util.initModal(this.modalName);
    this.util.initModal(this.modalServicesName, this.onOpenModalServicio());
  }

  ngOnInit() {
    this.GetEmpresas();
    this.ModalInit();
  }

  AsignarServicio(emp: Empleado) {
   $(this.modalServicesID).foundation('open');
  }

  openModal() {

  }

  SeleccionoEmpresa(value) {
    console.log(value);
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
}
