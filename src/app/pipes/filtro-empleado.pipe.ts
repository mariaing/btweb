import { Pipe, PipeTransform } from '@angular/core';
import { Empleado } from '../models/Empleado';

@Pipe({
  name: 'filtroEmpleado'
})
export class FiltroEmpleadoPipe implements PipeTransform {

  filtroPalabra(str: String, empleado: Empleado){
    const filtro = str.toLowerCase();
    let res = false;
    res = empleado.nombres.toLocaleLowerCase().indexOf(filtro) !== -1;
    res = res || empleado.apellidos.toLocaleLowerCase().indexOf(filtro) !== -1;
    res = res || empleado.identificacion.toLocaleLowerCase().indexOf(filtro) !== -1;
    return res;
  }

  transform(items: Empleado[], filtro: string, IdEmpresa: number): any {

    let filter_items: Empleado[];

    if (Number(IdEmpresa) === -1) {
      filter_items = items;
    } else {
      filter_items = items.filter(item => (item.id_empresa === Number(IdEmpresa)));
    }

    if(filtro) {
      filter_items = filter_items.filter(item => this.filtroPalabra(filtro,item));
    }

    return filter_items;
  }
}
