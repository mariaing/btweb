import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiciosService } from './../../../services/servicios.service';
import { UtilService } from './../../../services/util.service';
import { Result } from '../../../models/Result';
import { Servicio } from './../../../models/Servicio';
import { GmapComponent } from '../../controls/gmap/gmap.component';
import { Intervalo } from './../../../models/Intervalo';
import { DashboardComponent } from './../../dashboard/dashboard.component';

declare var $;
declare var Foundation;
declare var google;

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css']
})
export class ConsultasComponent implements OnInit {

  @ViewChild('mapServicios') mapaComponent: GmapComponent;

  ModalServicioPosicionName = 'ModalServicioPosicion';
  ModalServicioPosicionID = '#ModalServicioPosicion';

  ModalServicioDetallesName = 'ModalServicioDetalles';
  ModalServicioDetallesID = '#ModalServicioDetalles';

  servicio_actual: Servicio;
  intervalo_actual: Intervalo;

  fecha_inicio = '';
  fecha_final = '';
  cedula = '';
  total_minutos = 0;

  resultado_servicios: Servicio[];
  intervalos: Intervalo[];

  constructor(private servicios: ServiciosService, public util: UtilService) {
    this.resultado_servicios = [];
  }

  ngOnInit() {
    const that = this;
    this.fecha_inicio = this.util.getActualDate();
    this.fecha_final = this.util.getActualDate();

    this.util.initModal(this.ModalServicioDetallesName);
    this.util.initModal(this.ModalServicioPosicionName, (modal) => {
      that.mapaComponent.InitMap();
      that.mapaComponent.SetMarker(this.servicio_actual.latitud, this.servicio_actual.longitud);
    });

  }

  getServicios() {
    if (this.cedula === '' || this.cedula === undefined) {
      this.util.showWarning('Debe proporcionar una cedula');
      return;
    }
    this.servicios.ObtenerServiciosByDocumento(this.cedula, this.fecha_inicio, this.fecha_final)
      .subscribe((s: Result<Servicio[]>) => {
        if (s.IsOk) {
          this.resultado_servicios = s.Data.map(m => {
            m.estadoTexto = this.util.ParseEstadoServicio(m.estado);
            m.porcentaje = Math.round((m.duracion_aprobada / m.duracion) * 100) + '%';
            return m;
          });
          console.log(this.resultado_servicios);
        } else {
          this.resultado_servicios = [];
          this.util.showError(s.Mensaje);
        }
      });
  }

  ShowPosition(servicio) {
    this.servicio_actual = servicio;
    console.log(this.servicio_actual);
    $(this.ModalServicioPosicionID).foundation('open');
  }

  ShowDetalles(servicio) {
    this.intervalos = [];
    this.servicio_actual = servicio;
    this.total_minutos = 0;
    this.servicios.ObtenerIntervalos(this.servicio_actual.id)
      .subscribe((s: Result<Intervalo[]>) => {
        if (s.IsOk) {

          this.intervalos = s.Data.map(m => {

            m.estadoTexto = this.util.ParseEstadoIntervalo(m.estado);

            if (m.motivo == null) {
              m.motivo = 'No definido';
            }

            if (m.estado === 1) {
              this.total_minutos += m.minutos;
            }

            return m;
          });

          console.log(this.intervalos);

          $(this.ModalServicioDetallesID).foundation('open');
        } else {
          this.util.showError(s.Mensaje);
        }
      });

  }

  ShowPhoto(intervalo) {
    this.intervalo_actual = intervalo;
    console.log(intervalo);
  }

  AceptarIntervalo(inter: Intervalo) {
    if (inter.estado > 0) { return; }
    this.servicios.UpdateIntervalo(inter.id, 1)
      .subscribe((s: Result<Intervalo>) => {
        if (s.IsOk) {
          // aplico cambios al intervalo actual
          inter.estado = s.Data.estado;
          inter.estadoTexto = this.util.ParseEstadoIntervalo(inter.estado);
          this.util.showSuccess('intervalo aprobado exitosamente');
        } else {
          this.util.showError(s.Mensaje);
        }
      });
  }

  NegarIntervalo(inter: Intervalo) {
    if (inter.estado > 0) { return; }
    this.servicios.UpdateIntervalo(inter.id, 2)
      .subscribe((s: Result<Intervalo>) => {
        if (s.IsOk) {
          // aplico cambios al intervalo actual
          inter.estado = s.Data.estado;
          inter.estadoTexto = this.util.ParseEstadoIntervalo(inter.estado);
          this.util.showSuccess('intervalo negado exitosamente');
        } else {
          this.util.showError(s.Mensaje);
        }
      });
  }

  CancelarServicio() {
    if (this.servicio_actual === undefined) { return; }
    if (this.servicio_actual.estado === 5 || this.servicio_actual.estado === 6) {
      this.util.showError('El servicio ya fue tramitado');
      return;
    }
    this.servicios.UpdateServicio(this.servicio_actual.id, 6)
      .subscribe((s: Result<Servicio>) => {
        if (s.IsOk) {
          this.servicio_actual.estado = s.Data.estado;
          this.servicio_actual.estadoTexto = this.util.ParseEstadoServicio(this.servicio_actual.estado);
          this.util.showSuccess('Servicio Cancelado exitosamente');
        } else {
          this.util.showError('Servicio Cancelado exitosamente');
        }
      });
  }

  PagarServicio() {
    if (this.servicio_actual === undefined) { return; }
    if (this.servicio_actual.estado === 5 || this.servicio_actual.estado === 6) {
      this.util.showError('El servicio ya fue tramitado');
      return;
    }

    this.servicios.UpdateServicio(this.servicio_actual.id, 5)
      .subscribe((s: Result<Servicio>) => {
        if (s.IsOk) {
          this.servicio_actual.estado = s.Data.estado;
          this.servicio_actual.estadoTexto = this.util.ParseEstadoServicio(this.servicio_actual.estado);
          this.util.showSuccess('Servicio Pagado exitosamente');
        } else {
          this.util.showError('Servicio Pagado exitosamente');
        }
      });
  }

  ReanudarServicio() {
    this.servicios.ReanudarServicio(this.servicio_actual.id)
      .subscribe((s: Result<Servicio>) => {
        if (s.IsOk) {
          this.util.showSuccess('Servicio Reanudado exitosamente');
        } else {
          this.util.showError(s.Mensaje);
        }
      });
  }

  EliminarServicio(servicio: Servicio) {
    this.servicios.EliminarServicio(servicio.id)
      .subscribe((s: Result<Servicio>) => {
        if (s.IsOk) {
          this.util.showSuccess('Servicio eliminado exitosamente');
          this.getServicios();
        } else {
          this.util.showError(s.Mensaje);
        }
      });
  }

}
