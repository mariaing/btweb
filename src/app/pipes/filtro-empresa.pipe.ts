import { Pipe, PipeTransform } from '@angular/core';
import { Empresa } from '../models/Empresa';

@Pipe({
  name: 'filtroEmpresa'
})
export class FiltroEmpresaPipe implements PipeTransform {

  transform(items: Empresa[], filtro?: string): any {
    if (!items || !filtro) { return items; }
    return items.filter(
      item => (
        item.nombre.toLocaleLowerCase().indexOf(filtro.toLocaleLowerCase())   !== -1 ||
        item.nit.toLocaleLowerCase().indexOf(filtro.toLocaleLowerCase())      !== -1 ||
        item.telefono.toLocaleLowerCase().indexOf(filtro.toLocaleLowerCase()) !== -1
      )
    );
  }

}
