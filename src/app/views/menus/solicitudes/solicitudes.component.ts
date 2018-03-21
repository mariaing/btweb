import { Component, OnInit } from '@angular/core';
import { UtilService } from './../../../services/util.service';
import { ServiciosService } from './../../../services/servicios.service';
import { Result } from '../../../models/Result';
import { Solicitud } from '../../../models/Solicitud';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {

  fecha_inicio: string;
  fecha_final: string;
  solicitudes: Solicitud[] = [];

  constructor(private util: UtilService, private svc: ServiciosService) { }

  ngOnInit() {
    this.fecha_inicio = this.util.getActualDate();
    this.fecha_final = this.util.getActualDate();
  }

  getSolicitudes() {
    this.svc.ObtenerSolicitudes(this.fecha_inicio, this.fecha_final)
      .subscribe((s: Solicitud[]) => {
        this.solicitudes = s.map(m => {
          m.nombre_empleado = m.empleado.nombres + ' ' + m.empleado.apellidos;
          m.identificacion_empleado = m.empleado.identificacion;
          return m;
        });
      });
  }

  AceptarReanudacion(actual_solicitud: Solicitud) {
    this.svc.AprobarSolicitud(actual_solicitud.id).subscribe((s: Result<Solicitud>) => {
      if (s.IsOk) {
        this.util.showSuccess('Solicitud aprobada exitosamente');
      } else {
        this.util.showError(s.Mensaje);
      }

      this.getSolicitudes();
    });
  }

  NegarReanudacion(actual_solicitud: Solicitud) {
    this.svc.NegarSolicitud(actual_solicitud.id).subscribe((s: Result<Solicitud>) => {
      if (s.IsOk) {
        this.util.showSuccess('Solicitud negada exitosamente');
      } else {
        this.util.showError(s.Mensaje);
      }

      this.getSolicitudes();
    });
  }

}
