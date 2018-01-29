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

  @ViewChild('mapa') mapaComponent: GmapComponent;
  @ViewChild('photo') photoComponent: PhotoUploaderComponent;
  
  loading = new Subject<number>();
  
  empresas: any = [];
  empleados: any = [];

  nuevoEmpleado: Empleado = new Empleado();
  filtro: string;
  modalName = 'ModalNuevoEditar';
  files: FileList;  

  constructor(private empSVC: EmpresasService, private emplSVC : EmpleadosService, private mapSVC: MapService, public util: UtilService) {  }

  GetEmpresas() {
    const that = this;    
    this.empSVC.all().subscribe(s => {            
      this.empresas = s;
    });

    
    this.emplSVC.getEmpleados().subscribe(s => {          
      this.empleados = s;
    });
  }

  ModalInit() {
    const that = this;
    this.util.initModal(this.modalName);
  }

  ngOnInit() {
    this.GetEmpresas();
    this.ModalInit();
  }

  openModal() {

  }

  SeleccionoEmpresa(value) {

  }

  ShowCrearEmpleado() {
    $('#ModalNuevoEditar').foundation('open');
  }

  Guardar() {
    const foto = this.photoComponent.GetPhoto();
    console.log(foto);
  }
}
