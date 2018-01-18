import { Injectable, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';

declare var Foundation;
declare var $;

@Injectable()
export class UtilService {  

  constructor(public toastr: ToastsManager) {     
    setInterval((s)=>{      
    },300);
  }  

  public appState : string;

  init(root : ViewContainerRef){
    this.toastr.setRootViewContainerRef(root);
  }

  showSuccess(mensaje : string){
    this.toastr.success(mensaje, '¡Exito!');      
  }

  showErrorTitle(title : string,mensaje : string) {
    this.toastr.error(mensaje, title);
  }

  showError(mensaje : string) {
    this.toastr.error(mensaje, 'Oops!');
  }

  showWarning() {
    this.toastr.warning('You are being warned.', 'Alert!');
  }

  showInfo() {
    this.toastr.info('Just some information for you.');
  }
  
  showCustom() {
    this.toastr.custom('<span style="color: red">Message in red.</span>', null, {enableHTML: true});
  }

  initModal(id : string){
    var modal = $(String.fromCharCode(35) + id);
    var found = new Foundation.Reveal(modal);    
  }

}