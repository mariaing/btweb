import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Empleado } from './../models/Empleado';

@Injectable()
export class EmpleadosService {

  constructor(private http: HttpClient) { }

  public getEmpleados() {
    return this.http.get('api/empleados');
  }

  public guardarEmpleados(empleado: Empleado) {
    return this.http.post('api/empleados', empleado);
  }
}
