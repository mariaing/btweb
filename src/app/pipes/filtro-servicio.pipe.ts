import { Pipe, PipeTransform } from '@angular/core';
import { Servicio } from './../models/Servicio';
import { UtilService } from './../services/util.service';

@Pipe({
  name: 'filtroServicio'
})
export class FiltroServicioPipe implements PipeTransform {

  constructor(private util: UtilService) {

  }

  transform(items: Servicio[], filtro?: string): any {
    if (!items || !filtro) { return items; }
    return items.filter(
      item => {
        const textoEstado: string = this.util.ParseEstadoServicio(item.estado);
        return (
          item.actividad.toLocaleLowerCase().indexOf(filtro.toLocaleLowerCase()) !== -1 ||
          item.observacion.toLocaleLowerCase().indexOf(filtro.toLocaleLowerCase()) !== -1 ||
          textoEstado.toLocaleLowerCase().indexOf(filtro.toLocaleLowerCase()) !== -1 ||
          (item.id + '').toLocaleLowerCase().indexOf(filtro.toLocaleLowerCase()) !== -1
        );
      });
  }

}
