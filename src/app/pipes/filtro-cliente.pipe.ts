import { Pipe, PipeTransform } from '@angular/core';
import { Cliente } from '../models/Cliente';

@Pipe({
  name: 'filtroCliente'
})
export class FiltroClientePipe implements PipeTransform {

  transform(items: Cliente[], filtro?: string): any {
    if (!items || !filtro) { return items; }
    return items.filter(
      item => (
        item.nombre.toLocaleLowerCase().indexOf(filtro.toLocaleLowerCase())   !== -1 ||
        item.apellido.toLocaleLowerCase().indexOf(filtro.toLocaleLowerCase())      !== -1 ||
        item.identificacion.toLocaleLowerCase().indexOf(filtro.toLocaleLowerCase()) !== -1
      ));
  }
}
