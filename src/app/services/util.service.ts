import { Injectable, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';
import { Subject } from 'rxjs/Subject';
import { query } from '@angular/core/src/animation/dsl';
import { Result } from './../models/Result';

declare var Foundation;
declare var jQuery: any;
declare var $;

@Injectable()
export class UtilService {

  constructor(public toastr: ToastsManager) { }

  public host = '';
  public hostProd = 'http://btproject.cerverodev.com/';

  public appState: string;
  public filtro: string;
  public loading = false;
  private Querys = 0;
  public ShowLoading = new Subject<number>();


  init(root: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(root);
  }

  showSuccess(mensaje: string) {
    this.toastr.success(mensaje, '¡Exito!');
  }

  showErrorTitle(title: string, mensaje: string) {
    this.toastr.error(mensaje, title);
  }

  showError(mensaje: string) {
    this.toastr.error(mensaje, 'Oops!');
  }

  showWarning(mensaje: string) {
    this.toastr.warning(mensaje, 'advertencia');
  }

  showInfo() {
    this.toastr.info('Just some information for you.');
  }

  showCustom() {
    this.toastr.custom('<span style="color: red">Message in red.</span>', null, { enableHTML: true });
  }

  initModal(id: string, onOpen?: any, onClose?: any) {
    const modal = $(String.fromCharCode(35) + id);
    const found = new Foundation.Reveal(modal);

    modal.on('open.zf.reveal', () => {
      setTimeout(() => { if (typeof onOpen !== 'undefined') { onOpen(modal); } }, 300);
    });

    modal.on('closed.zf.reveal', () => {
      if (typeof onClose === 'function') { onClose(modal); }
    });
  }

  LoadingOn() {
    this.Querys++;
    this.ShowLoading.next(this.Querys);
  }

  loadingOff() {
    this.Querys--;
    this.ShowLoading.next(this.Querys);
  }

  getActualDate() {
    const fecha = new Date();
    const year = fecha.getFullYear() + '-';
    let month = (fecha.getMonth() + 1) + '-';
    let day = fecha.getDate() + '';

    if (fecha.getMonth() < 10) { month = '0' + month; }
    if (fecha.getDate() < 10) { day = '0' + day; }

    return year + month + day;
  }

  ParseEstadoIntervalo(estado: number) {
    if (estado === 0) {
      return 'Pendiente';
    }
    if (estado === 1) {
      return 'Aprobado';
    }
    if (estado === 2) {
      return 'Negado';
    }

    return 'Indefinido';
  }

  ParseEstadoServicio(estado: number) {
    if (estado === 0) {
      return 'En Espera';
    }
    if (estado === 1) {
      return 'En Proceso';
    }
    if (estado === 2) {
      return 'Cumplido 1/2';
    }
    if (estado === 3) {
      return 'Cumplido';
    }
    if (estado === 4) {
      return 'Vencido';
    }
    if (estado === 5) {
      return 'Pagado';
    }
    if (estado === 6) {
      return 'Cancelado';
    }

    return 'Indefinido';
  }

  getTime() {
    const fecha = new Date();
    let hora = fecha.getHours() + '';
    let minutos = fecha.getMinutes() + '';

    if (fecha.getHours() < 10) { hora = '0' + hora; }
    if (fecha.getMinutes() < 10) { minutos = '0' + minutos; }

    return hora + ':' + minutos;
  }

  Str2Date(str: string, hora: number, minuto: number): Result<Date> {
    const component = str.split('-');
    try {
      console.log(component);
      const data = new Date(Number(component[0]), Number(component[1]) - 1, Number(component[2]), hora, minuto, 0, 0);
      const res = new Result<Date>();
      res.Data = data;
      res.IsOk = true;
      return res;
    } catch (e) {
      const res = new Result<Date>();
      res.IsOk = false;
      return res;
    }
  }
}
