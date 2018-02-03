import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Servicio } from '../models/Servicio';

@Injectable()
export class ServiciosService {

  constructor(private http: HttpClient) { }

  GuardarServicio(servicio: Servicio) {
    return this.http.post('api/servicio/save', servicio);
  }

  ObtenerServicios(id_empleado: number, fecha_inicial: string, fecha_final: string) {
    return this.http.get(`api/servicio/${id_empleado}/${fecha_inicial}/${fecha_final}`);
  }

}
