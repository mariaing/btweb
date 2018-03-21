import { Component, OnInit, OnDestroy } from '@angular/core';
import { Cliente } from '../../../models/Cliente';
import { ClientesService } from './../../../services/clientes.service';
import { Result } from '../../../models/Result';
import { UtilService } from '../../../services/util.service';
import { ModalHandler } from '../../../util/modalHandler';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit, OnDestroy {

  EditorMode = false;
  nuevoCliente: Cliente;
  clientes: Cliente[];
  interval: any;
  mdl_nuevo_cliente: ModalHandler;


  constructor(private clienteSVC: ClientesService, private util: UtilService) { }

  ngOnInit() {
    this.getClientes();
    this.nuevoCliente = new Cliente();
    this.mdl_nuevo_cliente = new ModalHandler('ModalNuevoCliente');
    this.interval = setInterval(
      (tick) => {
        this.getClientes();
      }, 1000 * 10);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  getClientes() {
    this.clienteSVC.GetClientes().subscribe((clts: Result<Cliente[]>) => {
      if (clts.IsOk) {
        this.clientes = clts.Data;
      }else {
        this.util.showError(clts.Mensaje);
      }

      console.log(this.clientes);
    });
  }

  showUpdateCliente(cliente: Cliente) {
    this.nuevoCliente = cliente;
    this.EditorMode = true;
    this.mdl_nuevo_cliente.Show();
  }

  showNuevoCliente() {
    this.EditorMode = false;
    this.mdl_nuevo_cliente.Show();
  }

  limpiar() {
    this.nuevoCliente = new Cliente();
    this.mdl_nuevo_cliente.Hide();
  }

  Guardar() {
    this.clienteSVC.SaveCliente(this.nuevoCliente)
    .subscribe((clt: Result<Cliente>) => {
      if (clt.IsOk) {
        this.util.showSuccess('cliente guardado exitosamente!');
      } else {
        this.util.showError(clt.Mensaje);
      }

      this.getClientes();
      this.mdl_nuevo_cliente.Hide();
    });
  }

  Actualizar() {
    this.clienteSVC.UpdateCliente(this.nuevoCliente)
    .subscribe((clt: Result<Cliente>) => {
      if (clt.IsOk) {
        this.util.showSuccess('Cliente actualizado exitosamente');
      } else {
        this.util.showError(clt.Mensaje);
      }

      this.getClientes();
      this.mdl_nuevo_cliente.Hide();
    });
  }
}
