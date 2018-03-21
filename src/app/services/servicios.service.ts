import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Servicio } from '../models/Servicio';
import { UtilService } from './util.service';

@Injectable()
export class ServiciosService {

  constructor(private http: HttpClient, private util: UtilService) { }

  GuardarServicio(servicio: Servicio) {
    return this.http.post(this.util.hostProd + 'api/servicio/save', servicio);
  }

  ObtenerServicios(id_empleado: number, fecha_inicial: string, fecha_final: string) {
    return this.http.get(this.util.hostProd + `api/servicio/${id_empleado}/${fecha_inicial}/${fecha_final}`);
  }

  ObtenerServiciosByDocumento(id_empleado: string, fecha_inicial: string, fecha_final: string) {
    return this.http.get(this.util.hostProd + `api/servicio/${id_empleado}/${fecha_inicial}/${fecha_final}/bydoc`);
  }

  ObtenerIntervalos(id_servicio: number) {
    return this.http.get(this.util.hostProd + `api/servicio/intervalos/${id_servicio}`);
  }

  UpdateIntervalo(id_intervalo: number, estado: number) {
    return this.http.get(this.util.hostProd + `api/servicio/update/intervalo/${id_intervalo}/${estado}`);
  }

  UpdateServicio(id_servicio: number, estado: number) {
    return this.http.get(this.util.hostProd + `api/servicio/update/${id_servicio}/${estado}`);
  }

  ReanudarServicio(id_servicio: number) {
    return this.http.get(this.util.hostProd + `api/servicio/reanudar/${id_servicio}`);
  }

  ObtenerSolicitudes(fecha_inicial: string, fecha_final: string) {
    return this.http.get(this.util.hostProd + `api/servicio/solicitudes/${fecha_inicial}/${fecha_final}`);
  }

  AprobarSolicitud(id: number) {
    return this.http.get(this.util.hostProd + `api/servicio/solicitudes/aprobar/${id}`);
  }

  NegarSolicitud(id: number) {
    return this.http.get(this.util.hostProd + `api/servicio/solicitudes/negar/${id}`);
  }

  EliminarServicio(id: number) {
    return this.http.get(this.util.hostProd + `api/servicio/eliminar/${id}`);
  }
}
