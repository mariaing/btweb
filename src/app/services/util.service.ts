import { Injectable, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';

declare var Foundation;
declare var jQuery: any;
declare var $;

@Injectable()
export class UtilService {

  constructor(public toastr: ToastsManager) {
  }

  public appState: string;
  public filtro: string;
  public loading = false;

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

  showWarning() {
    this.toastr.warning('You are being warned.', 'Alert!');
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
      if (typeof onOpen !== 'undefined') { onClose(modal); }
    });
  }

  LoadingOn(){
    this.loading = true;
  }

  loadingOff(){
    this.loading = false;
  }

}
