import { Component, OnInit, ViewChild } from '@angular/core';
import { GmapComponent } from '../../controls/gmap/gmap.component';
import { Result } from '../../../models/Result';
import { Empresa } from './../../../models/Empresa';
import { EmpresasService } from '../../../services/empresas.service';
import { MapService } from '../../../services/map.service';
import { UtilService } from '../../../services/util.service';
import { Empleado } from '../../../models/Empleado';

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
  empresas: any = [];
  nuevoEmpleado: Empleado = new Empleado();
  filtro: string;
  modalName = 'ModalNuevoEditar';
  files: FileList;

  constructor(private empSVC: EmpresasService, private mapSVC: MapService, public util: UtilService) { }

  GetEmpresas() {
    this.empSVC.all().subscribe(s => {
      this.empresas = s;
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

  getFiles(event: any) {
    this.files = event.target.files;
    for (let i = 0, f; f = this.files[i]; i++) {
      if (!f.type.match('image.*')) {
        continue;
      }
      let reader = new FileReader();
      reader.onload = (function (theFile) {
        return function (e) {
          const components = ['<img class="animated bounceIn" style="width:60%; margin-left:20%" src="', e.target.result, '" />'];
          document.getElementById('image').innerHTML = components.join('');
        };
      })(f);
      reader.readAsDataURL(f);
    }
  }
}
