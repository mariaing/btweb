import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EmpresasService {

  constructor(private http: HttpClient) { }

  all() {
    return this.http.get('api/empresas');    
  }
}
