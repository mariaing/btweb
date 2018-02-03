import { Pipe, PipeTransform } from '@angular/core';
import { Servicio } from './../models/Servicio';

@Pipe({
  name: 'filtroServicio'
})
export class FiltroServicioPipe implements PipeTransform {

  transform(items: Servicio[], filtro?: string): any {
    console.log('items:', items, 'filtro', filtro);
    if (!items || !filtro) { return items; }
    return items.filter(
      item => {
        const textoEstado: string = item.estadoTexto();
        return (
          item.actividad.toLocaleLowerCase().indexOf(filtro.toLocaleLowerCase()) !== -1 ||
          item.observacion.toLocaleLowerCase().indexOf(filtro.toLocaleLowerCase()) !== -1 ||
          textoEstado.toLocaleLowerCase().indexOf(filtro.toLocaleLowerCase()) !== -1 ||
          (item.id + '').toLocaleLowerCase().indexOf(filtro.toLocaleLowerCase()) !== -1
        );
      });
  }

}
