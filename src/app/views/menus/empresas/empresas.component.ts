import { Component, OnInit, ViewChild } from '@angular/core';
import { EmpresasService } from './../../../services/empresas.service';
import { MapService } from '../../../services/map.service';
import { UtilService } from './../../../services/util.service';
import { GmapComponent } from '../../controls/gmap/gmap.component';

declare var $;
declare var Foundation;
declare var google;

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit {

  @ViewChild('mapa') mapaComponent : GmapComponent; 

  empresas: any = [];
  modalName: string = "exampleModal1";
  mapName: string = "mapCreateEmpresa";
  constructor(private empSVC: EmpresasService, private mapSVC: MapService, private util: UtilService, ) { 
    
  }

  ngOnInit() {
    this.empSVC.all().subscribe(s => { this.empresas = s; });
    this.util.initModal(this.modalName);

    

    console.log($('#formulario').css('width'));
     

    $('#' + this.modalName).on(
      'open.zf.reveal',
      () => {
        setTimeout(() => {
          this.mapaComponent.InitMap();
        }, 500);
      });
  }

  ajustarMapa() {
    console.log("funciona el boton");
  }

}
