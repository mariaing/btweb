import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';
import { Cliente } from './../models/Cliente';

@Injectable()
export class ClientesService {

  constructor(private http: HttpClient, private util: UtilService) { }

  GetClientes() {
    return this.http.get(this.util.hostProd + 'api/clientes');
  }

  SaveCliente(cliente: Cliente) {
    return this.http.post(this.util.hostProd + 'api/clientes', cliente);
  }

  UpdateCliente(cliente: Cliente) {
    const uri = this.util.hostProd + 'api/clientes/' + cliente.identificacion;
    return this.http.post(uri , cliente);
  }
}
