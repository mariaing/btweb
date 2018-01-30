import { Component, OnInit, ViewChild } from '@angular/core';
import { EmpresasService } from './../../../services/empresas.service';
import { MapService } from '../../../services/map.service';
import { UtilService } from './../../../services/util.service';
import { GmapComponent } from '../../controls/gmap/gmap.component';
import { Empresa } from '../../../models/Empresa';
import { Result } from './../../../models/Result';


declare var $;
declare var Foundation;
declare var google;

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit {

  @ViewChild('mapa') mapaComponent: GmapComponent;
  @ViewChild('mapa2') mapa2Component: GmapComponent;

  nuevaEmpresa: Empresa = new Empresa();
  empresas: any = [];

  modalName = 'newEmpresaModal';
  modalID = '#newEmpresaModal';
  modal: any;

  showMapModalName = 'mapModal';
  showMapModalID = '#mapModal';
  showMapModal: any;

  SelectedEmp: Empresa;

  EditorMode = false;

  constructor(private empSVC: EmpresasService, private mapSVC: MapService, public util: UtilService) { }

  GetEmpresas() {
    const that = this;
    this.empSVC.all().subscribe(
      s => {
        this.empresas = s;
      }
    );
  }

  ModalsInit() {

    const that = this;
    this.util.initModal(
      this.modalName,
      () => {
        that.mapaComponent.InitMap();
        if(this.EditorMode) {
          that.mapaComponent.SetMarker(that.nuevaEmpresa.latitud, that.nuevaEmpresa.longitud);
        }
      },
      () => { that.limpiar(); }
    );

    this.util.initModal(
      this.showMapModalName,
      () => {
        that.mapa2Component.InitMap();
        that.mapa2Component.SetMarker(that.SelectedEmp.latitud, that.SelectedEmp.longitud);
      },
      () => { }
    );
  }

  ngOnInit() {
    this.GetEmpresas();
    this.ModalsInit();
  }

  Guardar() {
    const marker = this.mapaComponent.GetMarker();
    if (marker === null) {
      this.util.showErrorTitle('Error', 'Debe elegir una ubicacion valida');
      return;
    }

    this.nuevaEmpresa.latitud = marker.lat();
    this.nuevaEmpresa.longitud = marker.lng();
    this.nuevaEmpresa.id = null;
    this.empSVC.guardar(this.nuevaEmpresa).subscribe((s: Result<Empresa>) => {
      if (s.IsOk === true) {
        this.util.showSuccess('Registro guardado exitosamente!');
        $(this.modalID).foundation('close');
      } else {
        this.util.showError(s.Mensaje);
      }
    });
  }

  Actualizar() {
    const marker = this.mapaComponent.GetMarker();
    if (marker === null) {
      this.util.showErrorTitle('Error', 'Debe elegir una ubicacion valida');
      return;
    }

    this.nuevaEmpresa.latitud = marker.lat();
    this.nuevaEmpresa.longitud = marker.lng();

    this.empSVC.editar(this.nuevaEmpresa).subscribe((s: Result<Empresa>) => {
      if (s.IsOk === true) {
        this.util.showSuccess('Registro actualizado exitosamente!');
        $(this.modalID).foundation('close');
      } else {
        this.util.showError(s.Mensaje);
      }
    });
  }

  limpiar() {
    this.nuevaEmpresa = new Empresa();
    this.mapaComponent.ClearMarker();
    $(this.modalID).foundation('close');
  }

  MostrarUbicacion(emp: Empresa) {
    this.EditorMode = false;
    this.SelectedEmp = emp;
    $(this.showMapModalID).foundation('open');
  }

  MostrarEditar(emp: Empresa) {
    this.EditorMode = true;
    this.nuevaEmpresa = emp;
    $(this.modalID).foundation('open');
  }
}
