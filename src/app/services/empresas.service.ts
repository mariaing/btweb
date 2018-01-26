import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Empresa } from './../models/Empresa';

@Injectable()
export class EmpresasService {

  constructor(private http: HttpClient) { }

  all() {
    return this.http.get('api/empresas');
  }

  guardar(emp: Empresa){    
    return this.http.post('api/empresas/',emp);
  }

  editar(emp: Empresa) {
    return this.http.post('api/empresas/update/' + emp.id, emp);
  }

}
